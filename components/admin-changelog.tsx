"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, History, Edit, Trash2 } from "lucide-react"
import { loadProjects, saveProjects } from "@/lib/storage"
import type { Project, VersionLog } from "@/lib/types"

export function AdminChangelog() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingLog, setEditingLog] = useState<VersionLog | null>(null)
  const [formData, setFormData] = useState({
    version: "",
    type: "patch" as "major" | "minor" | "patch",
    changes: [""],
  })

  useEffect(() => {
    const savedProjects = loadProjects()
    setProjects(savedProjects.filter((p) => p.status === "completed"))
  }, [])

  const handleAddChange = () => {
    setFormData((prev) => ({
      ...prev,
      changes: [...prev.changes, ""],
    }))
  }

  const handleChangeUpdate = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      changes: prev.changes.map((change, i) => (i === index ? value : change)),
    }))
  }

  const handleRemoveChange = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      changes: prev.changes.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject || !formData.version.trim()) return

    const validChanges = formData.changes.filter((change) => change.trim())
    if (validChanges.length === 0) return

    const newLog: VersionLog = {
      id: editingLog?.id || Date.now().toString(),
      version: formData.version.trim(),
      type: formData.type,
      date: new Date().toISOString(),
      changes: validChanges,
    }

    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject) {
        const changelog = project.changelog || []
        const updatedChangelog = editingLog
          ? changelog.map((log) => (log.id === editingLog.id ? newLog : log))
          : [...changelog, newLog]

        return {
          ...project,
          version: formData.version.trim(),
          changelog: updatedChangelog.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        }
      }
      return project
    })

    setProjects(updatedProjects)

    // 更新所有项目数据
    const allProjects = loadProjects()
    const finalProjects = allProjects.map((project) => {
      const updated = updatedProjects.find((p) => p.id === project.id)
      return updated || project
    })
    saveProjects(finalProjects)

    // 重置表单
    setFormData({ version: "", type: "patch", changes: [""] })
    setIsEditing(false)
    setEditingLog(null)
  }

  const handleEdit = (log: VersionLog) => {
    setEditingLog(log)
    setFormData({
      version: log.version,
      type: log.type,
      changes: [...log.changes],
    })
    setIsEditing(true)
  }

  const handleDelete = (logId: string) => {
    if (!selectedProject) return

    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject) {
        return {
          ...project,
          changelog: (project.changelog || []).filter((log) => log.id !== logId),
        }
      }
      return project
    })

    setProjects(updatedProjects)

    // 更新所有项目数据
    const allProjects = loadProjects()
    const finalProjects = allProjects.map((project) => {
      const updated = updatedProjects.find((p) => p.id === project.id)
      return updated || project
    })
    saveProjects(finalProjects)
  }

  const selectedProjectData = projects.find((p) => p.id === selectedProject)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <History className="w-6 h-6" />
        <h2 className="text-2xl font-bold">版本日志管理</h2>
      </div>

      {/* 项目选择 */}
      <Card>
        <CardHeader>
          <CardTitle>选择项目</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedProject?.toString() || ""}
            onValueChange={(value) => setSelectedProject(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择要管理版本日志的项目" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  #{project.id} - {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 添加/编辑版本日志 */}
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "编辑版本日志" : "添加版本日志"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="version">版本号</Label>
                    <Input
                      id="version"
                      value={formData.version}
                      onChange={(e) => setFormData((prev) => ({ ...prev, version: e.target.value }))}
                      placeholder="1.0.0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">版本类型</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "major" | "minor" | "patch") =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="major">Major (重大更新)</SelectItem>
                        <SelectItem value="minor">Minor (功能更新)</SelectItem>
                        <SelectItem value="patch">Patch (修复更新)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>更新内容</Label>
                    <Button type="button" size="sm" variant="outline" onClick={handleAddChange}>
                      <Plus className="w-3 h-3 mr-1" />
                      添加
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.changes.map((change, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={change}
                          onChange={(e) => handleChangeUpdate(index, e.target.value)}
                          placeholder="输入更新内容..."
                        />
                        {formData.changes.length > 1 && (
                          <Button type="button" size="sm" variant="outline" onClick={() => handleRemoveChange(index)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{isEditing ? "更新" : "添加"}</Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditingLog(null)
                        setFormData({ version: "", type: "patch", changes: [""] })
                      }}
                    >
                      取消
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 版本日志列表 */}
          <Card>
            <CardHeader>
              <CardTitle>版本历史</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProjectData?.changelog && selectedProjectData.changelog.length > 0 ? (
                <div className="space-y-4">
                  {selectedProjectData.changelog.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={log.type === "major" ? "default" : log.type === "minor" ? "secondary" : "outline"}
                          >
                            v{log.version}
                          </Badge>
                          <span className="text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(log)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(log.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <ul className="text-sm space-y-1">
                        {log.changes.map((change, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">暂无版本日志</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
