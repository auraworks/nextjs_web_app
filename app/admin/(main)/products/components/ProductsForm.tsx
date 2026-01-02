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

interface ProductsFormProps {
  mode: "new" | "edit";
  initialData?: {
    productNameKo?: string;
    productNameEn?: string;
    category?: string;
    price?: number;
    stock?: number;
    description?: string;
    isVisible?: boolean;
  };
}

export default function ProductsForm({
  mode,
  initialData,
}: ProductsFormProps) {
  const router = useRouter();
  const [productNameKo, setProductNameKo] = React.useState(initialData?.productNameKo ?? "");
  const [productNameEn, setProductNameEn] = React.useState(initialData?.productNameEn ?? "");
  const [category, setCategory] = React.useState(initialData?.category ?? "book");
  const [price, setPrice] = React.useState(initialData?.price ?? 0);
  const [stock, setStock] = React.useState(initialData?.stock ?? 0);
  const [description, setDescription] = React.useState(initialData?.description ?? "");
  const [isVisible, setIsVisible] = React.useState(initialData?.isVisible ?? true);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    console.log("저장 처리", {
      productNameKo,
      productNameEn,
      category,
      price,
      stock,
      description,
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
              상품 {mode === "new" ? "등록" : "상세"}
            </h1>
          </div>

          {/* 상품명(한글) */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                상품명(한글)
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="text"
              placeholder="상품명(한글)을 입력해주세요"
              value={productNameKo}
              onChange={(e) => setProductNameKo(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 상품명(영문) */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                상품명(영문)
              </span>
            </div>
            <Input
              type="text"
              placeholder="상품명(영문)을 입력해주세요"
              value={productNameEn}
              onChange={(e) => setProductNameEn(e.target.value)}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 카테고리 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                카테고리
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">도서</SelectItem>
                <SelectItem value="electronics">전자제품</SelectItem>
                <SelectItem value="clothing">의류</SelectItem>
                <SelectItem value="food">식품</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 가격 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                가격
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="number"
              placeholder="가격을 입력해주세요"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 재고 */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                재고
              </span>
              <span className="text-[#D65856] font-semibold text-xl leading-6">*</span>
            </div>
            <Input
              type="number"
              placeholder="재고를 입력해주세요"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* 설명 */}
          <div className="flex items-start gap-4 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6">
                설명
              </span>
            </div>
            <Textarea
              placeholder="설명을 입력해주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 min-h-[120px] bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3] resize-none"
            />
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
