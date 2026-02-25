import { Metadata } from 'next';
import AcademyRegisterClient from './AcademyRegisterClient';

export const metadata: Metadata = {
  title: '학원 등록 | 쿠카티처스',
  description: '쿠카티처스에 학원을 등록하고 스마트한 관리를 시작하세요.',
};

export default function AcademyRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AcademyRegisterClient>{children}</AcademyRegisterClient>;
}