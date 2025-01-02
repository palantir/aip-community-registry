import { PersonMusic } from "../illustrations/PersonMusic";
import { Feature } from "../components/Feature";
import { HiOutlineCloudDownload } from "react-icons/hi";
import { HeartBeat } from "../illustrations/HeartBeat";
import { CgUndo } from "react-icons/cg";
import { LogoNText } from "../components/LogoNText";
import { IoLogoAndroid, IoLogoApple } from "react-icons/io";
import { HiCode } from "react-icons/hi";
import { SIZE_LIMIT } from "../shared/utils";
import { NAME } from "../constants";

const faq = [
  [
    "What file formats do you support?",
    "Only Mp3 files are supported at the moment but I plan to add support for other common file formats before the official release.",
  ],
  [
    "Are there any limits to the amount of uploaded songs?",
    `To limit initial costs, each account can only upload 500 songs. Additionally, each file is limited to ${SIZE_LIMIT} MB. These limits will be removed or raised before the official release`,
  ],
  // [
  //   "Are there any limits to the size of each file?",
  //   `Each song is currently limited to ${SIZE_LIMIT} MB. Larger files will be supported before the official release.`,
  // ],
  [
    `Will ${NAME} eventually cost money?`,
    `In order to ensure longevity, ${NAME} might eventually offer premium plans. A free plan will also be available for those who want to test the service.`,
  ],
  [
    "Do you actually have iOS and Android apps?",
    "Yes! These apps are still in development and are not yet available on app stores.",
  ],
  [
    "Do you have duplicate detection?",
    `Yes! ${NAME} uses an MD5 hashing algorithm to automatically detect duplicate uploads.`,
  ],
  [
    "Can I transfer my Google Play Music library?",
    "There is currently no way to quickly transfer your library but this is something I want to implement before the release.",
  ],
  [
    "Can I purchase or stream songs from a preexisting catalogue?",
    "There is no way to purchase or stream music at this time. All audio files must be uploaded by you.",
  ],
  [
    `When will ${NAME} offer "X"?`,
    "I am currently dedicating my spare time developing this app and will be adding features very frequently.",
  ],
];

export const Hero = () => {
  // FIXME reduce x margin/padding on small devices
  return (
    <div className="flex flex-col flex-grow overflow-y-auto">
      <div className="py-16 px-10 md:px-20 lg:w-4/5 mx-auto flex-grow space-y-24">
        <div className="flex">
          <div className="space-y-5 sm:max-w-md">
            <h1 className="text-gray-800 dark:text-gray-200 tracking-tight text-4xl font-bold tight">
              Your Mp3 library.
            </h1>
            <span className="text-purple-800 dark:text-purple-400 text-xl leading-none">
              Streamed everywhere.
            </span>
            <div className="w-24 h-1 bg-purple-600" />
            <div className="text-gray-600 dark:text-gray-200 text-sm">
              Are you looking to cancel your Spotify subscription to save some
              cash? {NAME}™ allows you to upload your curated audio file
              collection and stream to all of your devices.
            </div>
            <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-200 ">
              <IoLogoApple
                title="iOS App Store"
                className="w-12 h-12 rounded-full p-3 border border-gray-700 dark:border-gray-200"
              />
              <IoLogoAndroid
                title="Android App Store"
                className="w-12 h-12 rounded-full p-3 border border-gray-700 dark:border-gray-200"
              />
              <HiCode
                title="Web Application"
                className="w-12 h-12 rounded-full p-3 border border-gray-700 dark:border-gray-200"
              />
            </div>
          </div>
          <div className="flex-grow" />
          {/* This div wrapper is important for formatting the svg */}
          <div>
            <PersonMusic className="h-48 md:h-56" />
          </div>
        </div>

        <div className="shadow-xl dark:bg-gray-700 bg-gray-400 rounded-xl hidden md:block">
          <img
            // Lazy so that we don't load it when it's hidden!
            // Important on mobile since it adds an extra quarter of a MB
            loading="lazy"
            src="/screenshot.png"
            className="shadow rounded-xl overflow-hidden transform translate-x-1 -translate-y-2"
            style={{ bottom: "" }}
          />
        </div>

        <div className="mx-auto">
          <Feature
            title="Mp3 Support"
            text="Upload your mp3 collection to our app using our web uploader."
            icon={HeartBeat}
          />
          <Feature
            reverse
            title="Stream Anywhere"
            text="Use the web and mobile apps to stream music to all of your devices."
            icon={HiOutlineCloudDownload}
          />
          <Feature
            title="Automatic Backups"
            text="Keep your music safe with our automatic backup system (Coming Soon)."
            last
            icon={CgUndo}
          />
          <div className="h-5" />
          <LogoNText
            logoClassName="w-16 h-16"
            textClassName="text-6xl"
            className="space-x-3 mt-6 text-gray-800 dark:text-white"
            // justify="start"
            glitch
          />
          <div className="h-16" />
          <div className="text-gray-800 dark:text-gray-200 space-y-4">
            <h1 className="text-2xl font-bold text-center">
              Frequently Asked Question
            </h1>
            <div className="border-b border-gray-400" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faq.map(([question, answer]) => (
                <div key={question} className="">
                  <div className="font-bold">{question}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
