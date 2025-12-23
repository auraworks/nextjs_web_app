import { redirect } from "next/navigation";
import { createClient } from "@/lib/server";

export default async function App() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 인증된 사용자는 /home으로 리다이렉트
  if (user) {
    redirect("/home");
  }

  // 인증되지 않은 경우 온보딩 시작 페이지로 리다이렉트
  redirect("/slides/start");
}
