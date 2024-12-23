import { NAME, PROD_WEB_ADDR } from "../constants";
import { H1, H2, P, A } from "../components/markdown";
import { Footer } from "../sections/Footer";

export const PrivacyPolicy = () => {
  return (
    <div className="overflow-y-scroll">
      <div className="max-w-xl m-auto py-12 text-gray-700 dark:text-gray-300 px-4">
        <H1>Privacy Policy for {NAME}</H1>

        <P>
          At {NAME}, accessible from <A href={PROD_WEB_ADDR}>{PROD_WEB_ADDR}</A>
          , one of our main priorities is the privacy of our visitors. This
          Privacy Policy document contains types of information that is
          collected and recorded by {NAME} and how we use it.
        </P>

        <P>
          If you have additional questions or require more information about our
          Privacy Policy, do not hesitate to contact us.
        </P>

        <P>
          This Privacy Policy applies only to our online activities and is valid
          for visitors to our website with regards to the information that they
          shared and/or collect in {NAME}. This policy is not applicable to any
          information collected offline or via channels other than this website.
        </P>

        <H2>Consent</H2>

        <P>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </P>

        <H2>Information we collect</H2>

        <P>
          The personal information that you are asked to provide, and the
          reasons why you are asked to provide it, will be made clear to you at
          the point we ask you to provide your personal information.
        </P>
        <P>
          If you contact us directly, we may receive additional information
          about you such as your name, email address, phone number, the contents
          of the message and/or attachments you may send us, and any other
          information you may choose to provide.
        </P>
        <P>
          When you register for an Account, we may ask for your contact
          information, including items such as name, company name, address,
          email address, and telephone number.
        </P>

        <H2>How we use your information</H2>

        <P>We use the information we collect in various ways, including to:</P>

        <ul>
          <li>Provide, operate, and maintain our website</li>
          <li>Improve, personalize, and expand our website</li>
          <li>Understand and analyze how you use our website</li>
          <li>Develop new products, services, features, and functionality</li>
          <li>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the website, and for
            marketing and promotional purposes
          </li>
          <li>Send you emails</li>
          <li>Find and prevent fraud</li>
        </ul>

        <H2>Log Files</H2>

        <P>
          {NAME} follows a standard procedure of using log files. These files
          log visitors when they visit websites. All hosting companies do this
          and a part of hosting services{`'`} analytics. The information
          collected by log files include internet protocol (IP) addresses,
          browser type, Internet Service Provider (ISP), date and time stamp,
          referring/exit pages, and possibly the number of clicks. These are not
          linked to any information that is personally identifiable. The purpose
          of the information is for analyzing trends, administering the site,
          tracking users{`'`} movement on the website, and gathering demographic
          information.
        </P>

        <H2>Cookies and Web Beacons</H2>

        <P>
          Like any other website, {NAME} uses {`'`}cookies{`'`}. These cookies
          are used to store information including visitors{`'`} preferences, and
          the pages on the website that the visitor accessed or visited. The
          information is used to optimize the users{`'`} experience by
          customizing our web page content based on visitors{`'`} browser type
          and/or other information.
        </P>

        <P>
          For more general information on cookies, please read{" "}
          <a href="https://www.cookieconsent.com/what-are-cookies/">
            {`"`}What Are Cookies{`"`}
          </a>
          .
        </P>

        <P>
          You can choose to disable cookies through your individual browser
          options. To know more detailed information about cookie management
          with specific web browsers, it can be found at the browsers{`'`}{" "}
          respective websites.
        </P>

        <H2>CCPA Privacy Rights (Do Not Sell My Personal Information)</H2>

        <P>
          Under the CCPA, among other rights, California consumers have the
          right to:
        </P>
        <P>
          Request that a business that collects a consumer{`'`}s personal data
          disclose the categories and specific pieces of personal data that a
          business has collected about consumers.
        </P>
        <P>
          Request that a business delete any personal data about the consumer
          that a business has collected.
        </P>
        <P>
          Request that a business that sells a consumer{`'`}s personal data, not
          sell the consumer
          {`'`}s personal data.
        </P>
        <P>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </P>

        <H2>GDPR Data Protection Rights</H2>

        <P>
          We would like to make sure you are fully aware of all of your data
          protection rights. Every user is entitled to the following:
        </P>
        <P>
          The right to access – You have the right to request copies of your
          personal data. We may charge you a small fee for this service.
        </P>
        <P>
          The right to rectification – You have the right to request that we
          correct any information you believe is inaccurate. You also have the
          right to request that we complete the information you believe is
          incomplete.
        </P>
        <P>
          The right to erasure – You have the right to request that we erase
          your personal data, under certain conditions.
        </P>
        <P>
          The right to restrict processing – You have the right to request that
          we restrict the processing of your personal data, under certain
          conditions.
        </P>
        <P>
          The right to object to processing – You have the right to object to
          our processing of your personal data, under certain conditions.
        </P>
        <P>
          The right to data portability – You have the right to request that we
          transfer the data that we have collected to another organization, or
          directly to you, under certain conditions.
        </P>
        <P>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </P>

        <H2>Children{`'`}s Information</H2>

        <P>
          Another part of our priority is adding protection for children while
          using the internet. We encourage parents and guardians to observe,
          participate in, and/or monitor and guide their online activity.
        </P>

        <P>
          {NAME} does not knowingly collect any Personal Identifiable
          Information from children under the age of 13. If you think that your
          child provided this kind of information on our website, we strongly
          encourage you to contact us immediately and we will do our best
          efforts to promptly remove such information from our records.
        </P>

        <H2>Changes to this Privacy Policy</H2>
        <P>
          {NAME} has the discretion to update this privacy policy at any time.
          When updates are made, the <a href="#update-date">revision date</a> at
          the bottom of this page will be updated.
        </P>

        <H2>Getting in Contact</H2>
        <P>
          Questions about this privacy policy can be sent to{" "}
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

export default PrivacyPolicy;
