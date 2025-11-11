import { useState } from "react";
import { entriesApi } from "@/lib/api/entries";
import { TfiReload } from "react-icons/tfi";
import { RxCross1 } from "react-icons/rx";

interface AISummaryProps {
  userId?: string;
}

export default function AISummary() {
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const fetchFeedback = async () => {
    try {
      setVisible(true); // visar modalen direkt
      setLoading(true);
      setError(null);

      const newFeedback = await entriesApi.getAISummary();

      if (!newFeedback) throw new Error("Failed to fetch AI feedback");

      setFeedback(newFeedback);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Flytande knapp */}
      {!visible && (
        <button
          onClick={fetchFeedback}
          className="fixed bottom-8 right-8 bg-dark-brown p-3 rounded-full shadow-lg hover:bg-dark-brown/80 transition cursor-pointer text-2xl"
          disabled={loading}
          aria-label="Show AI feedback"
        >
          <span className="animate-pulse">🤖</span>
        </button>
      )}

      {/* Modal */}
      {visible && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-xs "
          onClick={() => setVisible(false)} // stäng modal vid klick utanför
        >
          <div
            className="bg-white rounded-md shadow-md p-6 w-96 max-w-full relative z-50 "
            onClick={(e) => e.stopPropagation()} // stoppa click från att bubbla
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-dark-brown flex items-center gap-2">
                AI Feedback
              </h3>
              <div className="flex gap-2">
                {/* Reload-knapp */}
                <button
                  onClick={fetchFeedback}
                  disabled={loading}
                  className="p-1 rounded-md hover:bg-blue-100 hover:text-blue-800 transition"
                >
                  <TfiReload />
                  {/* {loading ? "Genererar..." : "Reload"} */}
                </button>
                {/* Stäng-knapp */}

                <button
                  onClick={() => setVisible(false)}
                  className="p-1 rounded-md hover:bg-red-100 hover:text-red-800 transition"
                >
                  <RxCross1 />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-600 mb-2">{error}</p>}

            {/* Feedback / Loading */}
            <div className="text-gray-700 min-h-[80px]">
              {loading ? (
                <div className=" flex justify-center items-center ">
                  <span className="animate-pulse text-6xl">🤖</span>
                </div>
              ) : (
                <>
                  <p>{feedback}</p>

                  <div className="flex justify-end items-center ">
                    <span className="text-3xl  inline-block -translate-y-1">
                      /
                    </span>
                    <span className=" text-xl ">🤖</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
