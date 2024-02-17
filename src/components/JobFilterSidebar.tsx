import { jobTypes } from "@/lib/job-types";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Select from "./ui/select";
import prisma from "@/lib/prisma";
import { Button } from "./ui/button";
import { JobFilterValues, jobFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "./FormSubmitButton";


//server action 
async function filterJobs(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());
  const {q,type,location,remote} = jobFilterSchema.parse(values);
  const searchParams = new URLSearchParams({
    ...(q && {q:q.trim()}),
    ...(type && {type}),
    ...(location && {location}),
    ...(remote && {remote: "true"}),
  });
  
  redirect(`/?${searchParams.toString()}`);
}

// this code is to make sure that the when the page is loaded or you share this job link to someone else it doesn't reset the applied filters applied to search that specific job

interface JobFilterSidebarProps {
  defaultValues: JobFilterValues;
}



export default async function JobFilterSidebar({defaultValues}:JobFilterSidebarProps) {
  
  const distinctJobLocations = (await prisma.job
    .findMany({
      where: { approved: true },
      select: { location: true },
      distinct: ["location"],
    })
    .then((locations) =>
      locations.map(({ location }) => location).filter(Boolean),
    )) as string[];
  return (
    <aside className="sticky top-0 h-fit  rounded-lg border bg-background p-4 md:w-[260px] ">
      <form action={filterJobs} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Title , Company , etc."
              defaultValue={defaultValues.q}
            ></Input>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Select id="type" name="type" defaultValue={defaultValues.type || ""}>
              <option value="">All types</option>
              {jobTypes?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Select id="location" name="location" defaultValue={defaultValues.type || ""}>
              <option value="">All options</option>
              {distinctJobLocations?.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remote"
              name="remote"
              type="checkbox"
              className="scale-125 accent-black"
              defaultChecked={defaultValues.remote}
            />
            <Label htmlFor="remote">Remote Jobs</Label>
          </div>
          <FormSubmitButton className="w-full">
            Filter jobs
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
