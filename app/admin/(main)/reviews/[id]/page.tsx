import ReviewsForm from "../components/ReviewsForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReviewsDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 샘플 데이터 (실제로는 API 호출)
  const initialData = {
    authorName: "홍길동",
    productId: "product1",
    rating: 5,
    title: "정말 좋은 상품입니다",
    content: "이 상품을 구매하고 매우 만족스럽습니다. 다음에도 구매할 의향이 있습니다.",
    status: "approved",
    isVisible: true,
  };

  return <ReviewsForm mode="edit" initialData={initialData} />;
}
