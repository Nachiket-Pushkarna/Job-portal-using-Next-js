import { JobFilterValues } from "@/lib/validation";
import JobListItem from "./JobListItem";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface JobResultsProps {
  filterValues: JobFilterValues;
}

export default async function JobResults({filterValues:{q,type,location,remote}}: JobResultsProps) {

  const searchString = q?.split(" ").filter((word)=>word.length > 0).join("&");


  // IF user enters only one field then also search the database
  const searchFilter : Prisma.JobWhereInput = searchString ? 

  {
    OR: [
      {title: {search: searchString}},
      {companyName: {search: searchString}},
      {type: {search: searchString}},
      {locationType: {search: searchString}},
      {location: {search: searchString}},
    ]
  }

  : {};


  //IF user enters all fields then also search the database
  const where: Prisma.JobWhereInput = {
    AND: [
      searchFilter,
      type ? {type} : {},
      location ? {location}: {},
      remote ? {locationType : "Remote"} : {},
      {approved: true}
    ]
  }


  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobListItem job={job} key={job.id} />
      ))}
      {jobs.length === 0 && (
        <p className="m-auto text-center">
          No jobs found. Try adjusting your search filters.
        </p>
      )}
    </div>
  );
}
