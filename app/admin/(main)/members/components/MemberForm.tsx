"use client";

import * as React from "react";
import { useScrollUp } from "@/components/hooks/useScrollUp";
import { useToast } from "@/components/ui/Toast";
import { useModal } from "@/components/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Search } from "lucide-react";

interface MemberFormProps {
  mode: "new" | "edit";
  initialData?: {
    nameKo?: string;
    nameEn?: string;
    email?: string;
    phone?: string;
    level?: string;
    status?: string;
    memo?: string;
    isActive?: boolean;
  };
}

export default function MemberForm({ mode, initialData }: MemberFormProps) {
  const router = useScrollUp();
  const { success, error } = useToast();
  const {
    isOpen,
    config,
    isLoading,
    openModal,
    handleConfirm,
    handleCancel: handleModalCancel,
  } = useModal();
  const [isActive, setIsActive] = React.useState(initialData?.isActive ?? true);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = () => {
    console.log("저장 처리");
    const isSuccess = Math.random() > 0.5;
    setTimeout(() => {
      if (isSuccess) {
        success(
          mode === "edit" ? "회원이 수정되었습니다." : "회원이 등록되었습니다."
        );
      } else {
        error(
          mode === "edit"
            ? "회원 수정에 실패했습니다."
            : "회원 등록에 실패했습니다."
        );
      }
    }, 100);
    router.back();
  };

  const handleDelete = () => {
    openModal({
      title: "회원 삭제",
      message: "정말로 이 회원을 삭제하시겠습니까?",
      onConfirm: async () => {
        console.log("삭제 처리");
        const isSuccess = Math.random() > 0.5;
        if (isSuccess) {
          success("회원이 삭제되었습니다.");
        } else {
          error("회원 삭제에 실패했습니다.");
        }
        router.back();
      },
    });
  };

  return (
    <div className="flex bg-[#F3F2F0] w-full min-h-screen p-8 items-start justify-start">
      <div className="flex flex-col justify-center items-start gap-6 flex-1 rounded-[5px] bg-white p-11">
        <div className="flex flex-col items-start gap-4 self-stretch">
          {/* Header */}
          <div className="flex justify-between items-center self-stretch mb-2">
            <h1 className="text-[#2A2A2A] font-semibold text-2xl leading-8">
              회원 {mode === "new" ? "등록" : "상세"}
            </h1>
          </div>

          {/* Name (Korean & English) - Side by Side */}
          <div className="flex gap-4 w-full">
            {/* Name (Korean) */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
                <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                  이름(한)
                </span>
                <span className="text-[#D65856] font-semibold text-xl leading-6">
                  *
                </span>
              </div>
              <Input
                type="text"
                placeholder="이름을 입력해주세요"
                defaultValue={initialData?.nameKo ?? ""}
                className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
              />
            </div>

            {/* Name (English) */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
                <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                  이름(영)
                </span>
              </div>
              <Input
                type="text"
                placeholder="이름(영문)을 입력해주세요"
                defaultValue={initialData?.nameEn ?? ""}
                className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="flex gap-4 w-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
                <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                  이메일
                </span>
                <span className="text-[#D65856] font-semibold text-xl leading-6">
                  *
                </span>
              </div>
              <Input
                type="email"
                placeholder="이메일을 입력해주세요"
                defaultValue={initialData?.email ?? ""}
                className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
              />
            </div>

            <div className="flex items-center gap-4 flex-1">
              <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
                <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                  연락처
                </span>
              </div>
              <Input
                type="tel"
                placeholder="연락처를 입력해주세요"
                defaultValue={initialData?.phone ?? ""}
                className="flex-1 h-10 bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
              />
            </div>
          </div>

          {/* Level & Status */}
          <div className="flex gap-4 w-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
                <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                  회원등급
                </span>
              </div>
              <Select defaultValue={initialData?.level ?? "normal"}>
                <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                  <SelectValue placeholder="등급 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">일반</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="vvip">VVIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 flex-1">
              <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
                <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                  상태
                </span>
              </div>
              <Select defaultValue={initialData?.status ?? "active"}>
                <SelectTrigger className="flex-1 h-10 bg-white border-[#EBEBEB]">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                  <SelectItem value="suspended">정지</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Memo */}
          <div className="flex items-start gap-4 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                메모
              </span>
            </div>
            <Textarea
              placeholder="메모를 입력해주세요"
              defaultValue={initialData?.memo ?? ""}
              className="flex-1 min-h-[120px] bg-white border-[#EBEBEB] text-sm font-medium leading-5 placeholder:text-[#E3E3E3]"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex w-[160px] h-10 py-2 items-center gap-1 shrink-0">
              <span className="text-[#6D6D6D] font-semibold text-xl leading-6 w-[160px]">
                활성화
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked as boolean)}
              />
              <Label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                활성 상태
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center self-stretch">
          {/* Preview Button */}
          <Button variant="outline" className="w-[100px] gap-2.5">
            <Search className="w-4 h-4" />
            미리보기
          </Button>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2.5">
            {mode === "edit" && (
              <>
                {/* Cancel Button */}
                <Button
                  variant="outline"
                  className="w-[81px]"
                  onClick={handleCancel}
                >
                  취소
                </Button>

                {/* Delete Button */}
                <Button
                  variant="secondary"
                  className="w-[81px]"
                  onClick={handleDelete}
                >
                  삭제
                </Button>

                {/* Save Button */}
                <Button className="w-[81px]" onClick={handleSave}>
                  저장
                </Button>
              </>
            )}

            {mode === "new" && (
              <>
                {/* Cancel Button */}
                <Button
                  variant="outline"
                  className="w-[81px]"
                  onClick={handleCancel}
                >
                  취소
                </Button>

                {/* Save Button */}
                <Button className="w-[81px]" onClick={handleSave}>
                  저장
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {config && (
        <Modal
          isOpen={isOpen}
          title={config.title}
          message={config.message}
          onClose={handleModalCancel}
          onConfirm={handleConfirm}
          onCancel={handleModalCancel}
          isLoading={isLoading}
          confirmText="삭제"
          cancelText="취소"
        />
      )}
    </div>
  );
}
