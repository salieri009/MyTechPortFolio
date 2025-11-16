import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  FooterCopyright,
  FooterLegalLinks,
  FooterLegalLink
} from '@components/common/FooterComponents'

export function FooterLegal() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <>
      <FooterCopyright>
        © {currentYear} 정욱 반. All rights reserved.
      </FooterCopyright>
    </>
  )
}
