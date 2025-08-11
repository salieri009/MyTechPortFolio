import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Container, Card } from '@components/common'
import { getAcademics } from '@services/academics'
import type { Academic } from '@model/domain'

const TimelineContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const AcademicCard = styled(Card)`
  margin-bottom: 16px;
`

const AcademicTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`

const AcademicMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
`

const AcademicDescription = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.5;
`

export function AcademicsPage() {
  const { t } = useTranslation()
  const [academics, setAcademics] = useState<Academic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAcademics() {
      setLoading(true)
      try {
        const response = await getAcademics({})
        if (response.success) {
          setAcademics(response.data.items)
        }
      } catch (error) {
        console.error('Failed to fetch academics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAcademics()
  }, [])

  if (loading) {
    return (
      <Container>
        <h1>{t('academics.title')}</h1>
        <p>{t('common.loading')}</p>
      </Container>
    )
  }

  return (
    <Container>
      <h1>{t('academics.title')}</h1>
      <TimelineContainer>
        {academics.map((academic) => (
          <AcademicCard key={academic.id}>
            <AcademicTitle>{academic.name}</AcademicTitle>
            <AcademicMeta>
              <span>{academic.semester}</span>
              {academic.grade && <span>{t('academics.grade')}: {academic.grade}</span>}
            </AcademicMeta>
            {academic.description && <AcademicDescription>{academic.description}</AcademicDescription>}
          </AcademicCard>
        ))}
      </TimelineContainer>
    </Container>
  )
}
