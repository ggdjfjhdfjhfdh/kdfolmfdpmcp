import PrivacyPolicy from './privacy-policy';
import Terms from './terms';
import CookiesPolicy from './cookies';

export default function LegalIndex() {
  return (
    <div>
      <PrivacyPolicy />
      <Terms />
      <CookiesPolicy />
    </div>
  );
}
