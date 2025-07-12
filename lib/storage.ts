import type { Project, Comment } from "./types"

const STORAGE_KEY = "hundred-apps-data"
const ADMIN_KEY = "hundred-apps-admin"
const COMMENTS_KEY = "hundred-apps-comments"

export const saveProjects = (projects: Project[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  }
}

export const loadProjects = (): Project[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  }
  return []
}

export const saveAdminAuth = (isAuthenticated: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(isAuthenticated))
  }
}

export const loadAdminAuth = (): boolean => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(ADMIN_KEY)
    if (data) {
      return JSON.parse(data)
    }
  }
  return false
}

export const saveComments = (comments: Comment[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments))
  }
}

export const loadComments = (): Comment[] => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(COMMENTS_KEY)
    if (data) {
      return JSON.parse(data)
    }
  }
  return []
}

export const addComment = (comment: Omit<Comment, "id" | "createdAt" | "isRead">) => {
  const comments = loadComments()
  const newComment: Comment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isRead: false,
  }
  comments.push(newComment)
  saveComments(comments)
  return newComment
}
