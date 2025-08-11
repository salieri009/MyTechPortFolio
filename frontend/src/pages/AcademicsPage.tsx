import React, { useEffect, useState } from 'react'
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
  color: #0f172a;
`

const AcademicMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  color: #64748b;
  font-size: 14px;
`

const AcademicDescription = styled.p`
  color: #334155;
  line-height: 1.5;
`

export function AcademicsPage() {
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
        <h1>학업</h1>
        <p>로딩 중...</p>
      </Container>
    )
  }

  return (
    <Container>
      <h1>학업</h1>
      <TimelineContainer>
        {academics.map((academic) => (
          <AcademicCard key={academic.id}>
            <AcademicTitle>{academic.name}</AcademicTitle>
            <AcademicMeta>
              <span>{academic.semester}</span>
              {academic.grade && <span>성적: {academic.grade}</span>}
            </AcademicMeta>
            {academic.description && <AcademicDescription>{academic.description}</AcademicDescription>}
          </AcademicCard>
        ))}
      </TimelineContainer>
    </Container>
  )
}
