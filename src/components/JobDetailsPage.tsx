import { formatMoney } from "@/lib/utils";
import { Job } from "@prisma/client";
import { Briefcase, Globe2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "./Markdown";

interface JobPageProps {
  job: Job;
}

export default function JobDetailsPage({
  job: {
    title,
    description,
    companyName,
    applicationUrl,
    location,
    salary,
    type,
    locationType,
    companyLogoUrl,
  },
}: JobPageProps) {
  return (
    <section className="w-full grow space-y-5">
      <div className="flex flex-row items-center gap-3">
        {companyLogoUrl && (
          <Image
            src={companyLogoUrl}
            alt="Company logo"
            width={100}
            height={100}
            className="rounded-xl"
          />
        )}
        <div>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="font-semibold">
              {applicationUrl ? (
                <Link
                  className="text-green-500 hover:underline"
                  href={new URL(applicationUrl).origin}
                >
                  {companyName}
                </Link>
              ) : (
                <span>{companyName}</span>
              )}
            </p>
          </div>
          <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5">
          <Briefcase size={16} className="shrink-0" />
          {type}
        </p>
        <p className="flex items-center gap-1.5 ">
          <MapPin size={16} className="shrink-0" />
          {locationType}
        </p>
        <p className="flex items-center gap-1.5 ">
          <Globe2 size={16} className="shrink-0" />
          {location || "worldwide"}
        </p>
        <p className="flex items-center gap-1.5 ">
          <Briefcase size={16} className="shrink-0" />
          {formatMoney(salary)}
        </p>
          </div>
        </div>
      </div>
      <div>
        {description && <Markdown>{description}</Markdown>}
      </div>
    </section>
  );
}
