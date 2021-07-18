export default interface SearchAssessment {
  userId: number;
  title: string;
  page: number;
  pageSize: number;
  from_date: string; // yyyy/mm/dd
  to_date: string; // yyyy/mm/dd
}
