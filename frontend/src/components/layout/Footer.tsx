import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/ui/Container'
import { FooterBranding } from './footer/FooterBranding'
import { FooterNav } from './footer/FooterNav'
import { FooterContact } from './footer/FooterContact'
import { FooterSocial } from './footer/FooterSocial'
import { FooterLegal } from './footer/FooterLegal'
import {
  FooterWrapper,
  FooterContent,
  FooterGrid,
  FooterBottom
} from '@components/common/FooterComponents'

export function Footer() {
  const { t } = useTranslation()

  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          <FooterGrid>
            <FooterBranding />
            <FooterNav />
            <FooterContact />
            <FooterSocial />
          </FooterGrid>
          <FooterBottom>
            <FooterLegal />
          </FooterBottom>
        </FooterContent>
      </Container>
    </FooterWrapper>
  )
}
