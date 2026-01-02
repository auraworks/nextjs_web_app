"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MemberReportChart from "./components/MemberReportChart";
import MemberTrendChart from "./components/MemberTrendChart";
import ProgramApplicationsTable from "./components/ProgramApplicationsTable";
import { DashboardStats, ProgramApplication, SearchKeyword } from "./types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats] = useState<DashboardStats>({
    users: { new: 45, total: 2530 },
    plays: { new: 23, total: 1245 },
    authors: { new: 12, total: 456 },
    posts: { newPosts: 67, newComments: 134 },
    reports: { new: 8, incomplete: 15 },
  });

  const [applications] = useState<ProgramApplication[]>([
    {
      id: "1",
      email: "user1@example.com",
      title: "2025 신춘문예 희곡 부문",
      user: "김철수",
      date: "2025-01-15",
    },
    {
      id: "2",
      email: "user2@example.com",
      title: "청년 극작가 워크숍",
      user: "이영희",
      date: "2025-01-14",
    },
    {
      id: "3",
      email: "user3@example.com",
      title: "희곡 창작 아카데미",
      user: "박민수",
      date: "2025-01-13",
    },
    {
      id: "4",
      email: "user4@example.com",
      title: "연극 대본 공모전",
      user: "정수진",
      date: "2025-01-12",
    },
    {
      id: "5",
      email: "user5@example.com",
      title: "극작가 멘토링 프로그램",
      user: "최동욱",
      date: "2025-01-11",
    },
  ]);

  const [searchKeywords] = useState<SearchKeyword[]>([
    { keyword: "햄릿", count: 245 },
    { keyword: "로미오와 줄리엣", count: 198 },
    { keyword: "맥베스", count: 167 },
    { keyword: "오셀로", count: 143 },
    { keyword: "리어왕", count: 128 },
    { keyword: "한여름 밤의 꿈", count: 115 },
    { keyword: "베니스의 상인", count: 98 },
    { keyword: "줄리어스 시저", count: 87 },
    { keyword: "안토니와 클레오파트라", count: 76 },
    { keyword: "태풍", count: 65 },
  ]);

  return (
    <div className="flex bg-[#F2F3F0] w-full min-h-screen flex-col items-start gap-11 p-8 pl-11 pr-11">
      <h1 className="self-stretch text-2xl font-bold leading-8 text-gray-1">
        Weekly 리포트
      </h1>

      <div className="flex flex-col items-start gap-6 self-stretch">
        <div className="flex h-[427px] items-center gap-6 self-stretch">
          <div className="flex flex-1 flex-col gap-6 self-stretch">
            <div className="flex flex-1 items-center gap-6">
              <Card className="flex w-1/3 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  회원 현황
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.users.new}명
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.users.total.toLocaleString()}명
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/members")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-blue-500 px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white hover:bg-blue-600"
                  >
                    회원 관리
                  </Button>
                </div>
              </Card>

              <Card className="flex w-1/3 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  상품 데이터
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.plays.new}개
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.plays.total.toLocaleString()}개
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/products")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-blue-500 px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white hover:bg-blue-600"
                  >
                    상품 관리
                  </Button>
                </div>
              </Card>

              <Card className="flex w-1/3 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  주문 데이터
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.authors.new}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.authors.total.toLocaleString()}건
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/orders")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-blue-500 px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white hover:bg-blue-600"
                  >
                    주문 관리
                  </Button>
                </div>
              </Card>
            </div>

            <div className="flex flex-1 items-center gap-6">
              <Card className="flex flex-1 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  리뷰 데이터
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규 리뷰
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.posts.newPosts}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        전체 리뷰
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.posts.newComments}건
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/reviews")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-blue-500 px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white hover:bg-blue-600"
                  >
                    리뷰 관리
                  </Button>
                </div>
              </Card>

              <Card className="flex flex-1 flex-col items-start gap-5 bg-white p-7 px-8">
                <h3 className="self-stretch text-lg font-bold leading-6 text-primary">
                  문의 데이터
                </h3>
                <div className="flex flex-col items-center gap-3.5 self-stretch">
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        신규 문의
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-1">
                        {stats.reports.new}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between self-stretch">
                      <span className="text-sm font-normal leading-4 text-gray-1 opacity-70">
                        미답변
                      </span>
                      <span className="text-center text-xl font-normal leading-6 tracking-[-0.4px] text-gray-3">
                        {stats.reports.incomplete}건
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push("/admin/chat")}
                    className="flex h-auto w-full items-center justify-center gap-1.5 self-stretch rounded bg-blue-500 px-3 py-2.5 text-sm font-bold leading-4 tracking-[-0.28px] text-white hover:bg-blue-600"
                  >
                    문의 관리
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <Card className="flex w-[328px] flex-col items-start gap-4 self-stretch bg-white p-8">
            <h3 className="text-lg font-semibold leading-6 text-[#2A2A2A]">
              상품별 인기도/검색 통계
            </h3>
            <div className="flex flex-col items-start self-stretch flex-1">
              <div className="flex items-center justify-between self-stretch pb-2 border-b border-[#E5E5E5]">
                <div className="flex flex-1 items-center gap-3">
                  <span className="w-7 text-xs font-semibold leading-4 text-[#6B7280]">
                    순번
                  </span>
                  <span className="flex-1 text-xs font-semibold leading-4 text-[#6B7280]">
                    상품명
                  </span>
                </div>
                <span className="w-14 text-right text-xs font-semibold leading-4 text-[#6B7280]">
                  검색 수
                </span>
              </div>

              <div className="flex flex-col items-start self-stretch flex-1 overflow-auto">
                {searchKeywords.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between self-stretch py-2 border-b border-[#F5F5F5] last:border-0"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <span className="w-7 text-xs font-medium leading-4 text-[#9CA3AF]">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-xs font-medium leading-4 text-[#374151]">
                        {item.keyword}
                      </span>
                    </div>
                    <span className="w-14 text-right text-xs font-bold leading-4 text-primary">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6 self-stretch">
          <Card className="flex flex-col items-start gap-6 bg-white p-11 px-11">
            <div className="flex flex-col items-start gap-6 self-stretch">
              <h3 className="text-xl font-bold leading-6 text-black">
                회원 리포트
              </h3>
            </div>
            <div className="w-full overflow-x-auto">
              <MemberReportChart />
            </div>
          </Card>

          <Card className="flex flex-col items-start gap-6 bg-white p-11 px-11">
            <div className="flex items-center justify-between self-stretch">
              <h3 className="text-xl font-bold leading-[30px] tracking-[-0.4px] text-black">
                회원 추세
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold leading-4 tracking-[-0.28px] text-gray-4">
                  전체
                </span>
                <span className="text-xl font-bold leading-6 text-black">
                  {stats.users.total.toLocaleString()}명
                </span>
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <MemberTrendChart />
            </div>
          </Card>
        </div>

        <ProgramApplicationsTable applications={applications} />
      </div>
    </div>
  );
}
