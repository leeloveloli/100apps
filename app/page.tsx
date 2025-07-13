"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Grid, List, ExternalLink } from "lucide-react"
import { ProjectDetailModal } from "@/components/project-detail-modal"
import { loadProjects } from "@/lib/storage"
import type { Project } from "@/lib/types"

// 状态配置
const statusConfig = {
  planned: { label: "待规划", color: "bg-gray-200 text-gray-600", bgColor: "bg-gray-100" },
  planning: { label: "规划中", color: "bg-yellow-200 text-yellow-800", bgColor: "bg-yellow-50" },
  developing: { label: "开发中", color: "bg-blue-200 text-blue-800", bgColor: "bg-blue-50" },
  completed: { label: "已完成", color: "bg-green-200 text-green-800", bgColor: "bg-green-50" },
}

// 已完成的应用映射
const completedAppRoutes: Record<number, string> = {
  3: '/apps/code-converter', // 代码转换器
  9: '/apps/calculator', // 在线计算器
  10: '/apps/markdown-editor', // Markdown编辑器
  14: '/apps/qr-generator', // 二维码生成器
}

// 生成初始项目数据的函数
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
    "Markdown编辑器",
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
    let status: Project["status"] = "planned"

    // 计算器已完成
    if (id === 9) status = "completed"
    // 代码转换器已完成  
    if (id === 3) status = "completed"
    // Markdown编辑器已完成
    if (id === 10) status = "completed"
    // 二维码生成器已完成
    if (id === 14) status = "completed"

    return {
      id,
      title: projectTitles[index] || `应用项目 ${id}`,
      description: `这是第${id}个应用项目的描述`,
      status,
      link: status === "completed" && completedAppRoutes[id] ? completedAppRoutes[id] : undefined,
      github: status === "completed" ? `https://github.com/leeloveloli/100apps` : undefined,
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

export default function HundredApps() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const savedProjects = loadProjects()
    if (savedProjects.length > 0) {
      setProjects(savedProjects)
    } else {
      const initialProjects = generateInitialProjects()
      setProjects(initialProjects)
    }
  }, [])

  const completedCount = projects.filter((p) => p.status === "completed").length
  const completionRate = projects.length > 0 ? ((completedCount / 100) * 100).toFixed(1) : "0.0"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Grid className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">用 AI 写 100 个有用的应用</h1>
            </div>
            <p className="text-lg text-gray-600 mb-6">每个格子代表一个AI应用项目</p>

            {/* Progress */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-lg font-medium">
                {completedCount}/100 已完成 ({completionRate}%)
              </span>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center gap-2">
              <Button
                variant={viewMode === "list" ? "outline" : "default"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                列表视图
              </Button>
              <Button
                variant={viewMode === "grid" ? "outline" : "default"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                网格视图
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-10 gap-2 max-w-4xl mx-auto">
            {projects.map((project) => {
              const ProjectWrapper = project.link && project.status === "completed" 
                ? ({ children }: { children: React.ReactNode }) => (
                    <Link href={project.link!} className="block">
                      {children}
                    </Link>
                  )
                : ({ children }: { children: React.ReactNode }) => (
                    <div onClick={() => setSelectedProject(project)}>
                      {children}
                    </div>
                  )

              return (
                <ProjectWrapper key={project.id}>
                  <div
                    className={`
                      aspect-square rounded-lg border-2 border-gray-200 cursor-pointer
                      transition-all duration-200 hover:scale-105 hover:shadow-md
                      flex flex-col items-center justify-center text-center p-1
                      ${statusConfig[project.status].bgColor}
                      ${project.status === "completed" ? "border-green-300" : ""}
                      ${project.status === "developing" ? "border-blue-300" : ""}
                      ${project.status === "planning" ? "border-yellow-300" : ""}
                    `}
                  >
                    <div className="text-xs font-bold text-gray-700 mb-1">{project.id}</div>
                    <div className="text-[10px] leading-tight text-gray-600 line-clamp-2">
                      {project.status === "planned" ? "待规划" : project.title}
                    </div>
                    {project.link && project.status === "completed" && (
                      <ExternalLink className="w-3 h-3 text-green-600 mt-1" />
                    )}
                  </div>
                </ProjectWrapper>
              )
            })}
          </div>
        ) : (
          /* List View */
          <div className="max-w-4xl mx-auto space-y-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-sm font-bold">
                        {project.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{project.title}</h3>
                          {project.link && project.status === "completed" && (
                            <Link href={project.link} className="text-blue-600 hover:text-blue-800">
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        {project.version && <p className="text-xs text-gray-500 mt-1">版本: v{project.version}</p>}
                      </div>
                    </div>
                    <Badge className={statusConfig[project.status].color}>{statusConfig[project.status].label}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center mt-8">
          <div className="flex gap-6 text-sm">
            {Object.entries(statusConfig).map(([status, config]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${config.color.split(" ")[0]}`}></div>
                <span>{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Project Detail Modal */}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}