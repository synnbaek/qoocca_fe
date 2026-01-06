'use client';

import style from './TermsSection.module.css';

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
        <label>
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
        <label className={style.item}>
          <input
            type="checkbox"
            checked={agreements.service}
            onChange={(e) => handleIndividualAgree('service', e.target.checked)}
          />
          <span className={style.required}>[필수]</span>
          서비스 이용약관 동의
        </label>

        <label className={style.item}>
          <input
            type="checkbox"
            checked={agreements.privacy}
            onChange={(e) => handleIndividualAgree('privacy', e.target.checked)}
          />
          <span className={style.required}>[필수]</span>
          개인정보 수집 및 이용 동의
        </label>

        <label className={style.item}>
          <input
            type="checkbox"
            checked={agreements.thirdParty}
            onChange={(e) =>
              handleIndividualAgree('thirdParty', e.target.checked)
            }
          />
          <span className={style.required}>[필수]</span>
          개인정보 제3자 제공 이용 동의
        </label>

        <label className={style.item}>
          <input
            type="checkbox"
            checked={agreements.marketing}
            onChange={(e) =>
              handleIndividualAgree('marketing', e.target.checked)
            }
          />
          <span className={style.optional}>[선택]</span>
          마케팅 정보 수신 동의
        </label>
      </div>
    </div>
  );
}
