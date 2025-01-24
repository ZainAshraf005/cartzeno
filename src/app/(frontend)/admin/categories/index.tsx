import dynamic from "next/dynamic";

// Dynamically import the page component with SSR disabled
const AdminCategoriesPage = dynamic(() => import("./page"), { ssr: false });

export default AdminCategoriesPage;
