import React from 'react'
import styled from 'styled-components'

export interface Technology {
  name: string
  icon: string
}

export interface TechCategory {
  id: string
  title: string
  icon: string
  technologies: Technology[]
}

const IconContainer = styled.div<{ size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size * 0.6}px;
  color: ${props => props.theme.colors.primary[500]};
  transition: all 0.3s ease;
`

const TECH_ICONS: Record<string, string> = {
  // Frontend
  react: '⚛️',
  typescript: '🔷',
  javascript: '🟨',
  html: '🟧',
  css: '🎨',
  vite: '⚡',
  'styled-components': '💅',
  'state-management': '🗃️',
  'react-router': '🗺️',
  threejs: '🎲',
  i18n: '🌐',
  
  // Backend
  spring: '🍃',
  java: '☕',
  nodejs: '🟢',
  express: '🚀',
  api: '🔌',
  security: '🔒',
  jwt: '🎫',
  oauth: '🔐',
  
  // Database
  mysql: '🐬',
  h2: '💽',
  mongodb: '🍃',
  postgresql: '🐘',
  hibernate: '💤',
  
  // DevOps
  git: '📝',
  github: '🐙',
  docker: '🐳',
  aws: '☁️',
  gradle: '🏗️',
  maven: '📦',
  cicd: '🔄',
  
  // Tools
  vscode: '💙',
  intellij: '🧠',
  postman: '📮',
  webstorm: '🌪️',
  figma: '🎭',
  
  // Default
  default: '🛠️'
}

interface TechIconProps {
  name: string
  size?: number
  className?: string
}

export function TechIcon({ name, size = 24, className }: TechIconProps) {
  const icon = TECH_ICONS[name] || TECH_ICONS.default

  return (
    <IconContainer size={size} className={className}>
      {icon}
    </IconContainer>
  )
}
