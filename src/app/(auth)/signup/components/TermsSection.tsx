"use client";

import style from "./TermsSection.module.css";

const TERMS_CONFIG = [
  { id: "service", label: "서비스 이용약관 동의", required: true },
  { id: "privacy", label: "개인정보 수집 및 이용 동의", required: true },
  { id: "thirdParty", label: "개인정보 제3자 제공 이용 동의", required: true },
  { id: "marketing", label: "마케팅 정보 수신 동의", required: false },
] as const;

interface TermsSectionProps {
  agreements: {
    service: boolean;
    privacy: boolean;
    thirdParty: boolean;
    marketing: boolean;
  };
  setAgreements: React.Dispatch<
    React.SetStateAction<{
      service: boolean;
      privacy: boolean;
      thirdParty: boolean;
      marketing: boolean;
    }>
  >;
}

export default function TermsSection({
  agreements,
  setAgreements,
}: TermsSectionProps) {
  const isAllAgreed = Object.values(agreements).every(Boolean);

  const handleAllAgree = (checked: boolean) => {
    setAgreements({
      service: checked,
      privacy: checked,
      thirdParty: checked,
      marketing: checked,
    });
  };

  const handleIndividualAgree = (
    key: keyof typeof agreements,
    checked: boolean
  ) => {
    setAgreements((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className={style.termsContainer}>
      <div className={style.allAgreeWrapper}>
        <label className={style.checkboxLabel}>
          <input
            type="checkbox"
            checked={isAllAgreed}
            onChange={(e) => handleAllAgree(e.target.checked)}
          />
          <span className={style.boldText}>전체 동의하기</span>
        </label>
      </div>

      <hr className={style.divider} />

      <div className={style.individualWrapper}>
        {TERMS_CONFIG.map((term) => (
          <label key={term.id} className={style.item}>
            <input
              type="checkbox"
              checked={agreements[term.id]}
              onChange={(e) => handleIndividualAgree(term.id, e.target.checked)}
            />
            <span className={term.required ? style.required : style.optional}>
              {term.required ? "[필수]" : "[선택]"}
            </span>
            <span className={style.termLabel}>{term.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}