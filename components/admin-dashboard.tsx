"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Edit, Search, Download, Upload } from "lucide-react"
import { ProjectForm } from "./project-form"
import { AdminComments } from "./admin-comments"
import { AdminChangelog } from "./admin-changelog"
import { saveProjects, loadProjects, saveAdminAuth, loadComments } from "@/lib/storage"
import type { Project, ProjectStatus } from "@/lib/types"

interface AdminDashboardProps {
  onLogout: () => void
}

const statusConfig = {
  planned: { label: "待规划", color: "bg-gray-200 text-gray-600" },
  planning: { label: "规划中", color: "bg-yellow-200 text-yellow-800" },
  developing: { label: "开发中", color: "bg-blue-200 text-blue-800" },
  completed: { label: "已完成", color: "bg-green-200 text-green-800" },
}

// 生成初始项目数据
const generateInitialProjects = (): Project[] => {
  const projectTitles = [
    "个人导航网站",
    "图片格式转换",
    "番茄红包打卡",
    "T恤DIY",
    "随机人物生成站",
    "配色更新器",
    "待办事项管理",
    "天气预报应用",
    "在线计算器",
    "音乐播放器",
    "密码生成器",
    "番茄钟",
    "颜色选择器",
    "二维码生成器",
    "记账本",
    "单位转换器",
    "笔记应用",
    "图片编辑器",
    "文件管理器",
    "聊天应用",
    "博客系统",
    "电商平台",
    "社交网络",
    "视频播放器",
    "游戏平台",
    "学习管理系统",
    "项目管理工具",
    "代码编辑器",
    "数据可视化",
    "API测试工具",
    "网站监控",
    "邮件客户端",
    "日历应用",
    "地图应用",
    "翻译工具",
    "图表生成器",
    "表单构建器",
    "文档编辑器",
    "演示工具",
    "时间追踪器",
    "习惯追踪器",
    "健身应用",
    "食谱应用",
    "旅行规划",
    "预算管理",
    "库存管理",
    "在线投票",
    "问卷调查",
    "抽奖系统",
    "签到打卡",
    "倒计时器",
    "随机选择器",
    "进制转换",
    "正则测试",
    "JSON格式化",
    "Base64编解码",
    "URL短链生成",
    "Markdown编辑器",
    "代码高亮",
    "Git提交生成",
    "CSS动画库",
    "图标生成器",
    "字体预览",
    "渐变生成器",
    "阴影生成器",
    "边框生成器",
    "响应式测试",
    "性能监控",
    "SEO检测",
    "网站截图",
    "域名查询",
    "IP查询",
    "端口扫描",
    "网速测试",
    "Ping测试",
    "DNS查询",
    "SSL证书检查",
    "HTTP状态码",
    "用户代理检测",
    "屏幕分辨率",
    "浏览器信息",
    "设备检测",
    "地理位置",
    "时区转换",
    "汇率转换",
    "股票查询",
    "加密货币",
    "彩票查询",
    "快递查询",
    "身份证查询",
    "手机归属地",
    "邮编查询",
    "区号查询",
    "万年历",
    "节假日查询",
    "星座运势",
    "生肖查询",
    "周公解梦",
    "姓名测试",
    "起名工具",
    "藏头诗生成",
    "对联生成",
    "古诗词查询",
    "成语查询",
    "歇后语",
  ]

  return Array.from({ length: 100 }, (_, index) => {
    const id = index + 1
    let status: ProjectStatus = "planned"

    if (id <= 5) status = "completed"
    else if (id === 6) status = "developing"
    else if (id === 7 || id === 8) status = "planning"

    return {
      id,
      title: projectTitles[index] || `应用项目 ${id}`,
      description: `这是第${id}个应用项目的描述`,
      status,
      link: status === "completed" ? `https://example.com/app-${id}` : undefined,
      github: status === "completed" ? `https://github.com/example/app-${id}` : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: status === "completed" ? "1.0.0" : undefined,
      changelog:
        status === "completed"
          ? [
              {
                id: Date.now().toString(),
                version: "1.0.0",
                date: new Date().toISOString(),
                changes: ["初始版本发布", "基础功能实现"],
                type: "major" as const,
              },
            ]
          : undefined,
    }
  })
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all")
  const [activeTab, setActiveTab] = useState("projects")

  useEffect(() => {
    const savedProjects = loadProjects()
    if (savedProjects.length > 0) {
      setProjects(savedProjects)
    } else {
      const initialProjects = generateInitialProjects()
      setProjects(initialProjects)
      saveProjects(initialProjects)
    }
  }, [])

  const handleLogout = () => {
    saveAdminAuth(false)
    onLogout()
  }

  const handleSaveProject = (updatedProject: Project) => {
    const newProjects = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    setProjects(newProjects)
    saveProjects(newProjects)
    setEditingProject(null)
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(projects, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "hundred-apps-data.json"
    link.click()
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedProjects = JSON.parse(e.target?.result as string)
          setProjects(importedProjects)
          saveProjects(importedProjects)
        } catch (error) {
          alert("导入失败：文件格式错误")
        }
      }
      reader.readAsText(file)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "completed").length,
    developing: projects.filter((p) => p.status === "developing").length,
    planning: projects.filter((p) => p.status === "planning").length,
    planned: projects.filter((p) => p.status === "planned").length,
  }

  const comments = loadComments()
  const unreadComments = comments.filter((c) => !c.isRead).length

  if (editingProject) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto flex justify-center">
          <ProjectForm project={editingProject} onSave={handleSaveProject} onCancel={() => setEditingProject(null)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">项目管理后台</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    导入数据
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
              </label>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">项目管理</TabsTrigger>
            <TabsTrigger value="comments" className="relative">
              留言管理
              {unreadComments > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs px-1 min-w-[1.2rem] h-5">
                  {unreadComments}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="changelog">版本日志</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">总项目</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                  <div className="text-sm text-gray-600">已完成</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.developing}</div>
                  <div className="text-sm text-gray-600">开发中</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.planning}</div>
                  <div className="text-sm text-gray-600">规划中</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{stats.planned}</div>
                  <div className="text-sm text-gray-600">待规划</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索项目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value: ProjectStatus | "all") => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="planned">待规划</SelectItem>
                  <SelectItem value="planning">规划中</SelectItem>
                  <SelectItem value="developing">开发中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-sm font-bold">
                          {project.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                          <div className="flex gap-2 text-xs text-gray-500">
                            {project.link && <span>演示: {project.link}</span>}
                            {project.github && <span>GitHub: {project.github}</span>}
                            {project.version && <span>版本: v{project.version}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusConfig[project.status].color}>
                          {statusConfig[project.status].label}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => setEditingProject(project)}>
                          <Edit className="w-3 h-3 mr-1" />
                          编辑
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comments">
            <AdminComments />
          </TabsContent>

          <TabsContent value="changelog">
            <AdminChangelog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
