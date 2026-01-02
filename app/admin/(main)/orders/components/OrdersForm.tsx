"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface OrdersFormProps {
  mode: "new" | "edit";
  initialData?: {
    orderNumber?: string;
    customerName?: string;
    customerPhone?: string;
    shippingAddress?: string;
    deliveryStatus?: string;
    trackingNumber?: string;
    paymentMethod?: string;
    totalAmount?: number;
  };
}

export default function OrdersForm({
  mode,
  initialData,
}: OrdersFormProps) {
  const router = useRouter();

  // 주문번호 자동생성
  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${day}${random}`;
  };

  const [orderNumber, setOrderNumber] = React.useState(initialData?.orderNumber ?? generateOrderNumber());
  const [customerName, setCustomerName] = React.useState(initialData?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = React.useState(initialData?.customerPhone ?? "");
  const [shippingAddress, setShippingAddress] = React.useState(initialData?.shippingAddress ?? "");
  const [deliveryStatus, setDeliveryStatus] = React.useState(initialData?.deliveryStatus ?? "paid");
  const [trackingNumber, setTrackingNumber] = React.useState(initialData?.trackingNumber ?? "");
  const [paymentMethod, setPaymentMethod] = React.useState(initialData?.paymentMethod ?? "card");
  const [totalAmount, setTotalAmount] = React.useState(initialData?.totalAmount ?? 0);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    console.log("저장 처리", {
      orderNumber,
      customerName,
      customerPhone,
      shippingAddress,
      deliveryStatus,
      trackingNumber,
      paymentMethod,
      totalAmount,
    });
    router.back();
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      console.log("삭제 처리");
      router.back();
    }
  };

  return (
    <div className="flex bg-[#F3F2F0] w-full min-h-screen p-8 items-start justify-start">
      <div className="flex flex-col justify-center items-start gap-6 flex-1 rounded-[5px] bg-white p-11">
        <div className="flex flex-col items-start gap-4 self-stretch">
          {/* Header */}
          <div className="flex justify-between items-center self-stretch mb-2">
            <h1 className="text-[#2A2A2A] font-semibold text-2xl leading-8">
              주문 {mode === "new" ? "등록" : "상세"}
            </h1>
          </div>

          {/* 주문번호 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                주문번호
              </span>
            </div>
            <Input
              type="text"
              value={orderNumber}
              readOnly
              className="flex-1 h-10 bg-gray-100 border-[#EBEBEB] text-sm font-medium leading-5"
            />
          </div>

          {/* 주문자 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                주문자
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="text"
              placeholder="주문자명을 입력해주세요"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 연락처 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                연락처
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="tel"
              placeholder="연락처를 입력해주세요"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 배송지 */}
          <div className="flex items-start gap-4 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                배송지
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Textarea
              placeholder="배송지를 입력해주세요"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="flex-1 min-h-[120px] bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3] resize-none"
            />
          </div>

          {/* 배송상태 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                배송상태
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
              <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                <SelectValue placeholder="배송상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">결제완료</SelectItem>
                <SelectItem value="preparing">배송준비</SelectItem>
                <SelectItem value="shipping">배송중</SelectItem>
                <SelectItem value="delivered">배송완료</SelectItem>
                <SelectItem value="canceled">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 송장번호 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                송장번호
              </span>
            </div>
            <Input
              type="text"
              placeholder="송장번호를 입력해주세요"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 결제수단 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                결제수단
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                <SelectValue placeholder="결제수단 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">신용카드</SelectItem>
                <SelectItem value="transfer">계좌이체</SelectItem>
                <SelectItem value="deposit">무통장입금</SelectItem>
                <SelectItem value="kakaopay">카카오페이</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 결제금액 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                결제금액
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="number"
              placeholder="결제금액을 입력해주세요"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between w-full pt-6 border-t border-[#E5E5E5]">
          <div>
            {mode === "edit" && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="h-10 px-6 border-2 border-red-500 text-red-500 hover:bg-red-50"
              >
                삭제
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-10 px-6 border-[#EBEBEB]"
            >
              취소
            </Button>
            <Button
              onClick={handleSave}
              className="h-10 px-6 bg-primary hover:bg-primary/90 text-white"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
