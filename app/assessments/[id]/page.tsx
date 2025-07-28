"use client"

import { AssessmentDetails } from "@/components/assessments/assessment-details"

interface AssessmentDetailsPageProps {
  params: {
    id: string
  }
}

export default function AssessmentDetailsPage({ params }: AssessmentDetailsPageProps) {
  return (
    <div className="container mx-auto py-6 px-4">
      <AssessmentDetails assessmentId={params.id} />
    </div>
  )
}
