import { NAME } from "../constants";
import { link } from "../classes";
import { H1, P, H2, LI } from "../components/markdown";
import { SIZE_LIMIT } from "../shared/utils";

export const BetaGuide = () => {
  return (
    <div className="overflow-y-auto min-h-0">
      <div className="px-8 mx-auto max-w-3xl text-gray-800 dark:text-gray-200 w-full py-5 beta-guide ">
        <H1 l="Beta Guide" />
        <P>
          Thanks again for signing up to test the app through the beta program.
          This platform was designed from the group up to provide a scalable
          solution to hosting and streaming audio files. Although there are
          still numerous limitations with the current platform, getting your
          feedback now is essential for future development.
        </P>

        <H2 l="Your Role" />
        <P>
          As beta testers, getting your feedback is incredibly important so that
          I know what features to prioritize and can fix existing bugs. Once
          logged in, navigate to the account dropdown in the top right corner
          and click "Feedback". From there, you can file your feature request,
          bug report or provide other general feedback.
        </P>

        <P className="pt-3">
          Here are some of the questions I'm hoping to answer:
        </P>

        <ul className="mt-2">
          <LI>
            Does the user interface look good? What about it do you dislike?
          </LI>
          <LI>Are there any accessibility issues?</LI>
          <LI>
            How can I help you transfer your current audio file collection to
            {NAME}?
          </LI>
          <LI>What file types do you want to be able to upload?</LI>
          <LI>What essential features is {NAME} currently missing?</LI>
        </ul>

        <H2 l="Getting Started" />
        <P>
          After logging in to the platform, follow the instructions to upload
          for your audio files (see the{" "}
          <a href="#limitations" className={link()}>
            Limitations
          </a>{" "}
          section below for file restrictions). Your songs, albums and artists
          will automatically start populating once your files have been
          processed in the cloud.
        </P>

        <H2 l="Mobile App"></H2>
        <P>
          The iOS and Android apps are well into development and are very close
          to being ready for beta. In the coming weeks, I will be selecting and
          contacting mobile app testers individually.
        </P>

        <H2 l="Limitations" />
        <P>
          There are several known limitations of the current system that I'll
          list below. Don't worry though, by the time app is actually released,
          these will all be resolved :)
        </P>
        <ul className="mt-2">
          <LI>You can only upload 500 songs</LI>
          <LI>{`Each song can be at most ${SIZE_LIMIT} MB`}</LI>
          <LI>You cannot download or backup songs that have been uploaded</LI>
          <LI>You cannot edit album metadata</LI>
          <LI>
            You cannot upload new album covers to songs after being uploaded
          </LI>
          <LI>The mobile app does not have offline support</LI>
          <LI>
            There is no way to automatically transfer your Google Play Music
            library
          </LI>
        </ul>

        {/* <H2 l="Known Issues" />
        <P>There are a few known issues that will be addressed soon.</P>
        <ul className="mt-2">
          <LI>Your</LI>
        </ul> */}
      </div>
    </div>
  );
};

export default BetaGuide;
