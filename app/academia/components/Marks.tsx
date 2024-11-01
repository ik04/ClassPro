'use client'
import Link from "@/components/Link";
import Refresh from "@/components/Refresh";
import Error from "@/components/States/Error";
import Loading from "@/components/States/Loading";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { FiInfo } from "react-icons/fi";
import NoData from "./subcomponents/NoData";
import { useData } from "@/provider/DataProvider";

const InfoPopup = dynamic(
  () => import("./subcomponents/Attendance/InfoPopup").then((a) => a.default),
  { ssr: false },
);
const Indicator = dynamic(
  () => import("@/components/Indicator").then((a) => a.default),
  { ssr: false },
);
const MarkCard = dynamic(
  () => import("./subcomponents/Marks/MarkCard").then((a) => a.default),
  { ssr: false },
);

export default function Marks() {
  const { marks, isLoading, error, isValidating, mutate } = useData();
  const isOld = false;
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const infoIconRef = useRef<HTMLDivElement>(null);

  const toggleInfoPopup = () => setShowInfoPopup((e) => !e);

  useEffect(() => {
    if(!isLoading && !error && !marks) {
      mutate()
    }
  }, [isLoading, mutate, marks, error]);


  return (
    <section id="marks" className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Marks</h1>
          <Link
            href="https://gradex.vercel.app"
            target="_blank"
            secondary
            className="flex items-center justify-center text-sm text-light-accent dark:text-dark-accent"
          >
            Predict
          </Link>
          <div className="relative" ref={infoIconRef}>
            <FiInfo
              className="cursor-help opacity-40"
              onClick={toggleInfoPopup}
              onMouseEnter={toggleInfoPopup}
              onMouseLeave={() => setShowInfoPopup(false)}
            />
            {showInfoPopup && (
              <InfoPopup
                warn
                text="Calculate how many marks you want to get to grab a certain grade."
                onClose={() => setShowInfoPopup(false)}
              />
            )}
          </div>
        </div>
        {!error && <Refresh type={{ mutateMarks: true }} isOld={isOld} />}
      </div>
      {isLoading ? (
        <Loading size="3xl" />
      ) : error ? (
        <Error component="Marks" error={error} />
      ) : marks ? (
        <div
          className={`${isValidating ? "border-light-info-color dark:border-dark-info-color" : "border-transparent"} flex flex-col gap-6 -mx-2 rounded-3xl border-4 border-dotted`}
        >
          <div className="grid animate-fadeIn grid-cols-marks gap-2 transition-all duration-200">
            {marks
              ?.filter((a) => a.courseType === "Theory")
              .map((mark, i) => <MarkCard key={i} mark={mark} />)}
          </div>
          {marks && marks[0] && <Indicator type="Practical" separator />}

          <div className="grid animate-fadeIn grid-cols-marks gap-2 transition-all duration-200">
            {marks
              ?.filter(
                (a) => a.courseType === "Practical" || a.courseType === "Lab",
              )
              .map((mark, i) => <MarkCard key={i} mark={mark} />)}
          </div>
        </div>
      ) : (
        <NoData component="Marks" />
      )}
    </section>
  );
}
