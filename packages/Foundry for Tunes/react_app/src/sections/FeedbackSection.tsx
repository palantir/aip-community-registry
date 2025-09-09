import { MutableRefObject, useEffect, useRef, useState } from "react";
import { link } from "../classes";
import { IssueOutlineOffset } from "../illustrations/IssueOutlineOffset";
import classNames from "classnames";
import { IdeaIcon } from "../illustrations/IdeaIcon";
import { MoreVerticalIcon } from "../illustrations/MoreVerticalIcon";
import { Button } from "../components/Button";
import { BlockAlert } from "../components/BlockAlert";
import { AirplaneIcon } from "../illustrations/AirplaneIcon";
import { bytesToHumanReadable, isMobile, toFileArray } from "../utils";
import { HiOutlineX } from "react-icons/hi";
import { DragDiv } from "../components/DragDiv";
import { Link } from "../components/Link";
import { SIZE_LIMIT } from "../shared/utils";

export interface FeedbackProps {
  onExit: () => void;
}

const IconInput = ({
  icon,
  checked,
  setChecked,
  name,
  id,
  label,
  disableOpacity,
}: {
  icon: (className: string) => JSX.Element;
  checked: boolean;
  setChecked: () => void;
  name: string;
  id: string;
  label: string;
  disableOpacity: boolean;
}) => {
  return (
    <>
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={(e) => e.target.checked && setChecked()}
      />
      <label htmlFor={id}>
        <div
          className={classNames(
            "transform duration-150 hover:scale-110 flex flex-col items-center",
            checked ? "scale-110" : !disableOpacity && "opacity-50"
          )}
        >
          {icon("h-20 w-20")}
          <span className="font-bold">{label}</span>
        </div>
      </label>
    </>
  );
};

const sizeLimitMb = 1024 * 1024 * SIZE_LIMIT;

export const FeedbackSection = ({
  setLoading,
  className,
  feedbackRef,
  filesRef,
}: {
  setLoading?: (value: boolean) => void;
  className?: string;
  filesRef?: MutableRefObject<Array<{ file: File; url: string }>>;
  feedbackRef?: MutableRefObject<string>;
}) => {
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState<"idea" | "issue" | "other">();
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  // const userData = useUserData();
  // const storage = useUserStorage();
  const fileUpload = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<Array<{ file: File; url: string }>>([]);

  useEffect(() => {
    if (filesRef) filesRef.current = files;
  }, [files, filesRef]);

  useEffect(() => {
    if (feedbackRef) feedbackRef.current = feedback;
  }, [feedback, feedbackRef]);

  const addFiles = (fileList: File[]) => {
    setFiles((current) => [
      ...current,
      ...fileList.map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  };

  const submitForm = async () => {
    // Just a sanity check! We disable the button anyway if these are not defined
    if (!type || !feedback) return;

    // const id = uuid.v4();
    // const ref = userData.feedback(id);

    // We don't tell users about this since it's unlikely they will try to upload this # of items
    if (files.length > 50) {
      setError("You can only upload a maximum of 50 items");
      return;
    }

    setError("");
    setLoading && setLoading(true);
    try {
      for (const { file } of files) {
        if (file.size > sizeLimitMb) {
          setError(`"${file.name}" is larger than ${SIZE_LIMIT} MB`);
          return;
        }

        // const ref = storage.feedbackUpload(id, file.name);
        // await ref.put(file);
      }

      // await ref.set({
      //   id,
      //   feedback,
      //   createdAt: serverTimestamp(),
      //   type,
      // });
    } catch (e) {
      setError("An unknown error occurred while submitting feedback.");
      throw e;
    } finally {
      setLoading && setLoading(false);
    }

    setFiles([]);
    setFeedback("");
    setType(undefined);
    setError("");
    setSuccess(true);
  };

  const uploadFileButton = (
    <button
      title="Upload feedback files"
      className={link()}
      onClick={(e) => {
        e.preventDefault();
        fileUpload.current && fileUpload.current.click();
      }}
    >
      {isMobile() ? "Click here" : "click here"}
    </button>
  );

  return (
    <div
      className={classNames(
        "space-y-2 px-6 py-5 dark:text-gray-200",
        className
      )}
    >
      {success ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <AirplaneIcon className="w-48" />
          </div>
          <BlockAlert type="success">
            <h1 className="font-bold">Thank you for your feedback!</h1>
            <p>
              Your feedback has been saved and will be used to guide future
              development. Make sure to keep an eye on the
              <Link route="release-notes" label="release notes" />.
            </p>
          </BlockAlert>
          <p className="text-center">
            Want to{" "}
            <button className={link()} onClick={() => setSuccess(false)}>
              submit again?
            </button>
          </p>
        </div>
      ) : (
        <>
          <h1 className="font-bold text-xl">Have some feedback?</h1>
          <p className="text-gray-700 dark:text-gray-400 text-sm sm:text-xs">
            Any feedback you have will help steer future development and is
            greatly appreciated 🌟
          </p>

          <form className="mt-10 space-y-2">
            <div className="flex justify-center space-x-6">
              {/* I had to add CSS :( Check out index.css */}
              <IconInput
                id="feedback-issue"
                name="feedback-type"
                checked={type === "issue"}
                setChecked={() => setType("issue")}
                icon={(className) => (
                  <IssueOutlineOffset className={className} />
                )}
                label="Issue"
                disableOpacity={type === undefined}
              />
              <IconInput
                id="feedback-idea"
                name="feedback-type"
                checked={type === "idea"}
                setChecked={() => setType("idea")}
                icon={(className) => <IdeaIcon className={className} />}
                label="Idea"
                disableOpacity={type === undefined}
              />
              <IconInput
                id="feedback-other"
                name="feedback-type"
                checked={type === "other"}
                setChecked={() => setType("other")}
                icon={(className) => <MoreVerticalIcon className={className} />}
                label="Other"
                disableOpacity={type === undefined}
              />
            </div>
            {type && (
              <>
                <label className="text-gray-700 dark:text-gray-300">
                  <span className="text-sm font-bold inline-block mt-6">
                    Description*
                  </span>

                  <textarea
                    className={classNames(
                      "border-gray-300 dark:border-gray-700 border rounded w-full py-1 px-2",
                      "dark:bg-gray-800"
                    )}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    required
                  />
                </label>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileUpload}
                  onChange={(e) => addFiles(toFileArray(e.target.files))}
                />
                <label className="text-gray-700 dark:text-gray-300">
                  <span className="text-sm font-bold leading-none">
                    Attach File(s)
                  </span>
                  <p className="text-xs">
                    Attach any screenshots or files that you think would help.
                    Each file must be equal or less than 20MB.
                  </p>
                  <DragDiv
                    className="rounded border border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center flex-col py-3 space-y-2 mt-2"
                    addFiles={addFiles}
                    dragOverClassName="bg-gray-200 dark:bg-gray-800"
                  >
                    {isMobile() ? (
                      <div className="text-sm ">
                        {uploadFileButton} to upload files!
                      </div>
                    ) : (
                      <div className="text-sm ">
                        Drag files or {uploadFileButton}!
                      </div>
                    )}
                  </DragDiv>
                </label>
                <div className="divide-y dark:divide-gray-700 text-gray-700 dark:text-gray-300 py-1">
                  {files.map(({ file, url }, i) => (
                    <div
                      key={i}
                      className="flex py-2 items-center justify-between space-x-2"
                    >
                      <div className="flex space-x-3 items-baseline min-w-0">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={classNames(
                            "leading-none truncate min-w-0 text-sm",
                            link()
                          )}
                          title={file.name}
                        >
                          {file.name}
                        </a>
                        <div className="text-xs leading-none text-gray-500 dark:text-gray-400">
                          {bytesToHumanReadable(file.size)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setFiles((files) => [
                            ...files.slice(0, i),
                            ...files.slice(i + 1, files.length),
                          ]);
                        }}
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Button
              theme={type === undefined || !feedback ? "disabled" : "purple"}
              label="Submit Feedback"
              className="uppercase w-full mt-2"
              onClick={(e) => {
                e.preventDefault();
                // Return the promise so we get the loading animation
                return submitForm();
              }}
            />
            {error && (
              <BlockAlert type="error" className="mt-3">
                {error}
              </BlockAlert>
            )}
          </form>
        </>
      )}
    </div>
  );
};
