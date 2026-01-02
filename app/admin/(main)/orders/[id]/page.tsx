import OrdersForm from "../components/OrdersForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrdersDetailPage({ params }: PageProps) {
  const { id } = await params;

  // 샘플 데이터 (실제로는 API 호출)
  const initialData = {
    orderNumber: id,
    customerName: "홍길동",
    customerPhone: "010-1234-5678",
    shippingAddress: "서울시 강남구 테헤란로 123, 101호",
    deliveryStatus: "shipping",
    trackingNumber: "123456789012",
    paymentMethod: "card",
    totalAmount: 150000,
  };

  return <OrdersForm mode="edit" initialData={initialData} />;
}
