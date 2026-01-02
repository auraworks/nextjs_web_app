"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/providers/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface ReviewsFormProps {
  mode: "new" | "edit";
  initialData?: {
    authorName?: string;
    productId?: string;
    rating?: number;
    title?: string;
    content?: string;
    status?: string;
    isVisible?: boolean;
  };
}

export default function ReviewsForm({
  mode,
  initialData,
}: ReviewsFormProps) {
  const router = useRouter();
  const [authorName, setAuthorName] = React.useState(initialData?.authorName ?? "");
  const [productId, setProductId] = React.useState(initialData?.productId ?? "");
  const [rating, setRating] = React.useState(initialData?.rating ?? 5);
  const [title, setTitle] = React.useState(initialData?.title ?? "");
  const [content, setContent] = React.useState(initialData?.content ?? "");
  const [status, setStatus] = React.useState(initialData?.status ?? "pending");
  const [isVisible, setIsVisible] = React.useState(initialData?.isVisible ?? true);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    console.log("저장 처리", {
      authorName,
      productId,
      rating,
      title,
      content,
      status,
      isVisible,
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
              리뷰 {mode === "new" ? "등록" : "상세"}
            </h1>
          </div>

          {/* 작성자 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                작성자
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="text"
              placeholder="작성자명을 입력해주세요"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 상품 선택 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                상품
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                <SelectValue placeholder="상품 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product1">상품A</SelectItem>
                <SelectItem value="product2">상품B</SelectItem>
                <SelectItem value="product3">상품C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 평점 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                평점
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Select value={String(rating)} onValueChange={(v) => setRating(Number(v))}>
              <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5점)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4점)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3점)</SelectItem>
                <SelectItem value="2">⭐⭐ (2점)</SelectItem>
                <SelectItem value="1">⭐ (1점)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 제목 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                제목
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="text"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 내용 */}
          <div className="flex items-start gap-4 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                내용
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Textarea
              placeholder="내용을 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 min-h-[120px] bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3] resize-none"
            />
          </div>

          {/* 상태 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                상태
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="approved">승인</SelectItem>
                <SelectItem value="rejected">거부</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 노출여부 */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                노출여부
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVisible"
                checked={isVisible}
                onCheckedChange={(checked) => setIsVisible(checked as boolean)}
              />
              <Label htmlFor="isVisible" className="text-sm font-medium">
                노출
              </Label>
            </div>
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
