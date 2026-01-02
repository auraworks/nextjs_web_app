import MemberForm from "../components/MemberForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { id } = await params;

  const initialData = {
    nameKo: "홍길동",
    nameEn: "Hong Gildong",
    email: "hong@example.com",
    phone: "010-1234-5678",
    level: "normal",
    status: "active",
    memo: "회원 메모입니다.",
    isActive: true,
  };

  return <MemberForm mode="edit" initialData={initialData} />;
}
