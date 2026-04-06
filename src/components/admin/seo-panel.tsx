'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { SEOAnalysis } from '@/lib/seo-analyzer'

interface SEOPanelProps {
  analysis: SEOAnalysis
}

export function SEOPanel({ analysis }: SEOPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusBadge = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">ممتاز</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">يحتاج تحسين</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">يحتاج إصلاح</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>تحليل السيو</span>
          <div className={`flex items-center gap-2 ${getScoreBgColor(analysis.score)} px-4 py-2 rounded-lg`}>
            <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}
            </span>
            <span className="text-sm text-slate-600">/100</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">الدرجة الإجمالية</span>
            <span className={`font-medium ${getScoreColor(analysis.score)}`}>
              {analysis.score >= 80 ? 'ممتاز' : analysis.score >= 60 ? 'جيد' : 'يحتاج تحسين'}
            </span>
          </div>
          <Progress
            value={analysis.score}
            className="h-3"
            indicatorClassName={
              analysis.score >= 80
                ? 'bg-green-600'
                : analysis.score >= 60
                ? 'bg-yellow-600'
                : 'bg-red-600'
            }
          />
        </div>

        {/* SEO Checks */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-slate-700">نتائج الفحص</h3>
          <div className="space-y-2">
            {analysis.checks.map((check, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="mt-0.5">{getStatusIcon(check.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-sm">{check.name}</span>
                    {getStatusBadge(check.status)}
                  </div>
                  <p className="text-sm text-slate-600">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              اقتراحات للتحسين
            </h3>
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-600 p-2 rounded bg-blue-50/50"
                >
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Score Legend */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-slate-600">80-100: ممتاز</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span className="text-slate-600">60-79: جيد</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-slate-600">0-59: ضعيف</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
