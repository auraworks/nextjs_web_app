import ProductsForm from "../components/ProductsForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductsDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 샘플 데이터 (실제로는 API 호출)
  const initialData = {
    productNameKo: "샘플 상품명",
    productNameEn: "Sample Product",
    category: "book",
    price: 25000,
    stock: 50,
    description: "이것은 샘플 상품 설명입니다.",
    isVisible: true,
  };

  return <ProductsForm mode="edit" initialData={initialData} />;
}
