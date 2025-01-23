import { errorHandler } from "@/lib/handlers/error-handler";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const POST = async (request: NextRequest) => {
  try {
    // Parse the multipart form data
    const formData = await request.formData();

    // Extract the file and other fields
    const image = formData.get("image") as File | null;
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const stock = parseInt(formData.get("stock") as string);
    const categoryId = formData.get("categoryId") as string;

    // Validate required fields
    if (!title || !price || !description || !stock || !categoryId || !image) {
      return NextResponse.json(
        { message: "All fields including image are required", success: false },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "File must be an image", success: false },
        { status: 400 }
      );
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { message: "Invalid categoryId", success: false },
        { status: 400 }
      );
    }

    // Create directory path
    const categoryName = categoryExists.name.replace(/\s+/g, "-");
    const productName = title.toLowerCase().replace(/\s+/g, "-");
    const imageDir = path.join(
      process.cwd(),
      "public",
      "categories",
      categoryName,
      productName
    );

    // Create directory if it doesn't exist
    await fs.mkdir(imageDir, { recursive: true });

    // Convert File to ArrayBuffer and then to Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert image to PNG format using sharp
    const pngBuffer = await sharp(buffer)
      .png({ quality: 90 }) // Convert to PNG with 90% quality
      .toBuffer();

    // Save the PNG image
    const imagePath = path.join(imageDir, "image.png");
    await fs.writeFile(imagePath, pngBuffer);

    // Generate public URL path for the image
    const productImage = `/categories/${categoryName}/${productName}/image.png`;

    // Create product in database
    const productCreated = await prisma.product.create({
      data: {
        title,
        price,
        description,
        stock,
        image: productImage,
        categoryId,
      },
    });

    return NextResponse.json(
      { success: true, product: productCreated },
      { status: 201 }
    );
  } catch (error: unknown) {
    return errorHandler(error, request);
  }
};

// Maximum file size (in bytes) - adjust as needed
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "5mb",
  },
};
