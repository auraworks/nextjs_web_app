"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { ProgramApplication } from "../types";

interface ProgramApplicationsTableProps {
  applications: ProgramApplication[];
}

export default function ProgramApplicationsTable({
  applications,
}: ProgramApplicationsTableProps) {
  const router = useRouter();

  return (
    <Card className="flex flex-col gap-6 bg-white p-8 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[#2A2A2A] leading-8">
          프로그램 신청 현황
        </h3>
        <Button
          onClick={() => router.push("/admin/programs")}
          className="h-10 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <span className="text-sm font-semibold tracking-[-0.28px]">
            프로그램 관리
          </span>
        </Button>
      </div>

      <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F5F5F5] border-b border-[#E5E5E5]">
              <TableHead className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                이메일
              </TableHead>
              <TableHead className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                프로그램명
              </TableHead>
              <TableHead className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                신청자
              </TableHead>
              <TableHead className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                신청일
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length > 0 ? (
              applications.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-[#E5E5E5] hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                    {item.email}
                  </TableCell>
                  <TableCell className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-5" />
                      <span className="text-center text-xs font-medium leading-5 text-[#0A0A0A]">
                        {item.user}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-[#0A0A0A] text-xs font-medium leading-5">
                    {item.date}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-[#0A0A0A] text-xs font-medium leading-5"
                >
                  신청 현황이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
