export type ProjectStatus = "planned" | "planning" | "developing" | "completed"

export interface Project {
  id: number
  title: string
  description: string
  status: ProjectStatus
  link?: string
  github?: string
  createdAt?: string
  updatedAt?: string
  version?: string
  changelog?: VersionLog[]
}

export interface Comment {
  id: string
  projectId: number
  author: string
  email?: string
  content: string
  createdAt: string
  isRead: boolean
}

export interface VersionLog {
  id: string
  version: string
  date: string
  changes: string[]
  type: "major" | "minor" | "patch"
}
