export default interface VitalSign {
    id: number
    title: string
    giv_description: string
    description: string
    value: string
    rate_is_increasing: number
    status: number
    units: string
    created_at: string
    updated_at: string
    publish_date: string
    unit_abbr: string
    display_in_dashboard: number
  }