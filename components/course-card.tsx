import Link from "next/link";
import { BookOpenIcon } from "lucide-react";
import Image from "next/image";
import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string | null;
  /** Optional flag to mark the image as priority if above the fold */
  priority?: boolean;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  priority = false,
}: CourseCardProps) => {
  return (
    <Link
      href={`/courses/${id}`}
      aria-label={`Course: ${title}`}
    >
      <div className="relative border rounded-md overflow-hidden h-full transition transform hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-y-2.5">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:underline">
              {title}
            </div>
            {category && (
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {category}
              </h3>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
            </p>
          </div>

          {progress !== null && (
            <div className="mt-4 flex items-center gap-x-2 text-gray-600 dark:text-gray-400 text-sm">
              <IconBadge size="sm" icon={BookOpenIcon} />
              <span aria-label={`Course progress: ${progress}%`}>
                {progress}%
              </span>
            </div>
          )}
        </div>

        {progress !== null ? (
          <div
            className="absolute bottom-2 right-2 w-28 h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={`Course progress: ${progress}%`}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs font-semibold px-3 py-1 rounded shadow">
            {formatPrice(price)}
          </div>
        )}
      </div>
    </Link>
  );
};
