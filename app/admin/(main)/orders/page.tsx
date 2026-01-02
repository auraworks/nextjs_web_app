"use client";

import { useState } from "react";
import { useScrollUp } from "@/components/hooks/useScrollUp";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Search, RefreshCw, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/Pagination";

// 샘플 데이터 생성 함수
function generateOrderData() {
  const customers = ["홍길동", "김철수", "이영희", "박민수", "정수진"];
  const deliveryStatuses = ["결제완료", "배송준비", "배송중", "배송완료", "취소"];
  const paymentMethods = ["신용카드", "계좌이체", "무통장입금", "카카오페이"];
  const data = [];

  for (let i = 1; i <= 50; i++) {
    const date = new Date(2024, (i % 12), ((i % 28) + 1));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const orderNum = String(i).padStart(4, '0');

    data.push({
      orderId: `ORD${year}${month}${day}${orderNum}`,
      orderNumber: `ORD${year}${month}${day}${orderNum}`,
      customerName: customers[i % customers.length],
      totalAmount: 10000 + (i * 5000),
      deliveryStatus: deliveryStatuses[i % deliveryStatuses.length],
      paymentMethod: paymentMethods[i % paymentMethods.length],
      createdAt: date.toISOString(),
    });
  }

  return data;
}

const allTableData = generateOrderData();

export default function OrdersPage() {
  const router = useScrollUp();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 7, 8));
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const itemsPerPageNum = parseInt(itemsPerPage);
  const totalPages = Math.ceil(allTableData.length / itemsPerPageNum);
  const startIndex = (currentPage - 1) * itemsPerPageNum;
  const endIndex = startIndex + itemsPerPageNum;
  const displayedData = allTableData.slice(startIndex, endIndex);

  const handleRowClick = (id: string) => {
    router.push(`/admin/orders/${id}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "배송완료":
        return "default";
      case "배송중":
        return "secondary";
      case "취소":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] px-12 py-12">
      <div className="w-full flex flex-col gap-6 flex-1 overflow-hidden">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-[#2A2A2A] leading-8">
          주문 관리
        </h1>

        {/* Filter Section */}
        <div className="flex flex-col gap-[18px] p-8 bg-[#FAF8F6] rounded">
          <div className="flex items-start gap-6">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <label className="w-auto text-base font-semibold text-[#555] leading-6">
                주문일
              </label>
              <div className="flex items-center gap-2.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[142px] h-10 justify-between text-left font-normal bg-white border-[#EBEBEB] shadow-none",
                        endDate && "text-primary font-semibold"
                      )}
                    >
                      {endDate ? (
                        format(endDate, "yyyy-MM-dd", { locale: ko })
                      ) : (
                        <span className="text-[#727272]">날짜 입력</span>
                      )}
                      <CalendarIcon className="ml-auto h-3 w-3 text-[#727272]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-transparent border-none shadow-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      required
                    />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-black">-</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[142px] h-10 justify-between text-left font-normal bg-white border-[#EBEBEB] shadow-none",
                        startDate && "text-primary font-semibold"
                      )}
                    >
                      {startDate ? (
                        format(startDate, "yyyy-MM-dd", { locale: ko })
                      ) : (
                        <span className="text-[#727272]">날짜 입력</span>
                      )}
                      <CalendarIcon className="ml-auto h-3 w-3 text-[#727272]" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-transparent border-none shadow-none"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      required
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Delivery Status Filter */}
            <div className="flex items-center gap-2">
              <label className="w-auto text-base font-semibold text-[#555] leading-6">
                배송상태
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="w-[142px] h-10 bg-white border-[#EBEBEB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="paid">결제완료</SelectItem>
                  <SelectItem value="preparing">배송준비</SelectItem>
                  <SelectItem value="shipping">배송중</SelectItem>
                  <SelectItem value="delivered">배송완료</SelectItem>
                  <SelectItem value="canceled">취소</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center gap-2">
              <label className="w-auto text-base font-semibold text-[#555] leading-6">
                결제수단
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="w-[142px] h-10 bg-white border-[#EBEBEB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="card">신용카드</SelectItem>
                  <SelectItem value="transfer">계좌이체</SelectItem>
                  <SelectItem value="deposit">무통장입금</SelectItem>
                  <SelectItem value="kakaopay">카카오페이</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex items-start gap-[18px]">
            <div className="flex items-center gap-2 flex-1">
              <label className="w-auto text-base font-semibold text-[#555] leading-6 whitespace-nowrap">
                검색어
              </label>
              <div className="flex items-center gap-[22px] flex-1">
                <Select defaultValue="orderNumber">
                  <SelectTrigger className="w-auto h-10 bg-white border-[#EBEBEB] text-primary font-semibold text-xs px-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orderNumber">주문번호</SelectItem>
                    <SelectItem value="customerName">주문자</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="검색조건을 입력해주세요"
                  className="flex-1 h-10 bg-white border-[#EBEBEB] text-xs text-[#727272] placeholder:text-[#727272]"
                />
              </div>
            </div>
            <div className="flex items-center gap-[18px]">
              <Button className="w-[120px] h-10 bg-blue-500 hover:bg-blue-600 text-white gap-2.5 shadow-none">
                <Search className="w-4 h-4" />
                <span className="font-semibold">검색</span>
              </Button>
              <Button
                variant="outline"
                className="w-[120px] h-10 border-[1.6px] border-blue-500 text-blue-500 hover:bg-blue-500/5 gap-2.5 shadow-none"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="font-normal">초기화</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <p className="text-xl text-[#6D6D6D] leading-6 tracking-[-0.4px]">
            총 <span className="text-primary">{allTableData.length}</span>건
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-10 border-2 border-[#4CA452] text-[#4CA452] hover:bg-[#4CA452]/5 gap-2 shadow-none"
            >
              <FileDown className="w-4 h-4 text-[#4CA452]" />
              <span className="text-sm font-semibold tracking-[-0.28px] text-[#4CA452]">
                엑셀 다운로드
              </span>
            </Button>
            <Button
              className="h-10 bg-blue-500 hover:bg-blue-600 text-white gap-2 shadow-none"
              onClick={() => router.push("/admin/orders/new")}
            >
              <span className="text-sm font-semibold tracking-[-0.28px]">
                주문 등록
              </span>
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-y-auto border border-[#E5E5E5] rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F5F5F5] border-b border-[#E5E5E5]">
                <TableHead className="text-center text-xs font-medium">No</TableHead>
                <TableHead className="text-center text-xs font-medium">주문번호</TableHead>
                <TableHead className="text-center text-xs font-medium">주문자</TableHead>
                <TableHead className="text-center text-xs font-medium">결제금액</TableHead>
                <TableHead className="text-center text-xs font-medium">결제수단</TableHead>
                <TableHead className="text-center text-xs font-medium">배송상태</TableHead>
                <TableHead className="text-center text-xs font-medium">주문일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedData.map((row, index) => (
                <TableRow
                  key={index}
                  className="border-b border-[#E5E5E5] cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleRowClick(row.orderId)}
                >
                  <TableCell className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                    {row.orderNumber}
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                    {row.customerName}
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                    {row.totalAmount.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                    {row.paymentMethod}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getStatusBadgeVariant(row.deliveryStatus)}>
                      {row.deliveryStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                    {new Date(row.createdAt).toLocaleDateString("ko-KR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="sticky bottom-0 left-0 right-0 flex items-start gap-6 bg-gray-100 pt-4">
          <Select value={itemsPerPage} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-auto h-[43px] bg-white border-[#EBEBEB] px-3">
              <SelectValue className="text-primary text-xs font-semibold" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10개씩 보기</SelectItem>
              <SelectItem value="20">20개씩 보기</SelectItem>
              <SelectItem value="50">50개씩 보기</SelectItem>
            </SelectContent>
          </Select>

          <div className=" flex w-full justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {[1, 2, 3].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {totalPages > 6 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {totalPages > 3 && [totalPages - 2, totalPages - 1, totalPages].map((page) => (
                  page > 3 && (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
