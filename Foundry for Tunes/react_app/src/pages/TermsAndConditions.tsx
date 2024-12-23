import { Footer } from "../sections/Footer";
import { Link } from "../components/Link";
import { H1, H2, P } from "../components/markdown";
import { NAME, PROD_WEB_ADDR } from "../constants";

export const TermsAndConditions = () => {
  return (
    <div className="overflow-y-scroll">
      <div className="max-w-xl m-auto py-12 text-gray-700 dark:text-gray-300 px-4">
        <H1>Terms and Conditions</H1>

        <P>Welcome to {NAME}!</P>

        <P>
          These terms and conditions outline the rules and regulations for the
          use of {NAME}'s Website, located at{" "}
          <a href={PROD_WEB_ADDR}>{PROD_WEB_ADDR}</a>.
        </P>

        <P>
          By accessing this website we assume you accept these terms and
          conditions. Do not continue to use {NAME} if you do not agree to take
          all of the terms and conditions stated on this page.
        </P>

        <P>
          The following terminology applies to these Terms and Conditions,
          Privacy Statement and Disclaimer Notice and all Agreements: "Client",
          "You" and "Your" refers to you, the person on this website and
          compliant to the Company’s terms and conditions. "The Company",
          "Ourselves", "We", "Our" and "Us", refers to our Company. "Party",
          "Parties", or "Us", refers to both the Client and ourselves. All terms
          refer to the offer, acceptance and consideration of payment necessary
          to undertake the process of our assistance to the Client in the most
          appropriate manner for the express purpose of meeting the Client’s
          needs in respect of provision of the Company’s stated services, in
          accordance with and subject to, prevailing law of Netherlands. Any use
          of the above terminology or other words in the singular, plural,
          capitalization and/or he/she or they, are taken as interchangeable and
          therefore as referring to same.
        </P>

        <H2>Cookies</H2>

        <P>
          We employ the use of cookies. By accessing {NAME}, you agreed to use
          cookies in agreement with the {NAME}'s Privacy Policy.{" "}
        </P>

        <P>
          Most interactive websites use cookies to let us retrieve the user’s
          details for each visit. Cookies are used by our website to enable the
          functionality of certain areas to make it easier for people visiting
          our website.
        </P>

        <H2>License</H2>

        <P>
          Unless otherwise stated, {NAME} and/or its licensors own the
          intellectual property rights for all material on {NAME}. All
          intellectual property rights are reserved. You may access this from
          {NAME} for your own personal use subjected to restrictions set in
          these terms and conditions.
        </P>

        <P>You must not:</P>
        <ul>
          <li>Republish material from {NAME}</li>
          <li>Sell, rent or sub-license material from {NAME}</li>
          <li>Reproduce, duplicate or copy material from {NAME}</li>
          <li>Redistribute content from {NAME}</li>
        </ul>

        <H2>Content Liability</H2>

        <P>
          We shall not be hold responsible for any content that appears on your
          Website. You agree to protect and defend us against all claims that is
          rising on your Website. No audio files should appear on any Website
          that may be interpreted as libelous, obscene or criminal, or which
          infringes, otherwise violates, or advocates the infringement or other
          violation of, any third party rights.
        </P>

        <H2>Your Privacy</H2>

        <P>
          Please read the <Link label="Privacy Policy" route="privacy" />.
        </P>

        <H2>Reservation of Rights</H2>

        <P>
          We reserve the right to request that you remove all links or any
          particular link to our Website. You approve to immediately remove all
          links to our Website upon request. We also reserve the right to amen
          these terms and conditions and it’s linking policy at any time. By
          continuously linking to our Website, you agree to be bound to and
          follow these linking terms and conditions.
        </P>

        <H2>Disclaimer</H2>

        <P>
          To the maximum extent permitted by applicable law, we exclude all
          representations, warranties and conditions relating to our website and
          the use of this website. Nothing in this disclaimer will:
        </P>

        <ul>
          <li>
            limit or exclude our or your liability for fraud or fraudulent
            misrepresentation;
          </li>
          <li>
            limit any of our or your liabilities in any way that is not
            permitted under applicable law; or
          </li>
          <li>
            exclude any of our or your liabilities that may not be excluded
            under applicable law.
          </li>
        </ul>

        <P>
          The limitations and prohibitions of liability set in this Section and
          elsewhere in this disclaimer: (a) are subject to the preceding
          paragraph; and (b) govern all liabilities arising under the
          disclaimer, including liabilities arising in contract, in tort and for
          breach of statutory duty.
        </P>

        <P>
          As long as the website and the information and services on the website
          are provided free of charge, we will not be liable for any loss or
          damage of any nature.
        </P>

        <H2>Changes to this Document</H2>
        <P>
          {NAME} has the discretion to update this document at any time. When
          updates are made, the <a href="#update-date">revision date</a> at the
          bottom of this page will be updated. By using this website you are
          agreeing to be bound by the current version of these terms of service.
        </P>

        <H2>Getting in Contact</H2>
        <P>
          Questions about this document can be sent to{" "}
          <i>jacobas@palantir.com</i>.
        </P>

        <P id="update-date" className="text-sm pt-8">
          This document was last updated on October 16th, 2024.
        </P>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
