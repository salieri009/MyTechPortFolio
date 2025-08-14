import React from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@components/ui/Container'
import { FooterBranding } from './footer/FooterBranding'
import { FooterNav } from './footer/FooterNav'
import { FooterContact } from './footer/FooterContact'
import { FooterSocial } from './footer/FooterSocial'
import { FooterLegal } from './footer/FooterLegal'
import { MobileFooter } from './footer/MobileFooter'
import {
  FooterWrapper,
  FooterContent,
  FooterGrid,
  FooterBottom
} from '@components/common/FooterComponents'
import styled from 'styled-components'

const DesktopFooter = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`

export function Footer() {
  const { t } = useTranslation()

  return (
    <>
      {/* 데스크톱/태블릿 Footer */}
      <DesktopFooter>
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
      </DesktopFooter>

      {/* 모바일 Footer */}
      <MobileFooter />
    </>
  )
}
