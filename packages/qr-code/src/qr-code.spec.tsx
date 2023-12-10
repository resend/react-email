import { render } from "@react-email/render";
import { QrCode } from './qr-code'; // Adjust the import path as needed

test('renders without crashing', () => {
    render(<QrCode value="test" size={300} correctionLevel="L" />);
});
describe('<QrCode> component', () => {
    // Test cases will go here
    it('renders QR code with required props', () => {
        const actualOutput = render(
            <QrCode value="test" size={300} correctionLevel="L" />
        );// Check if the value is rendered
        expect(actualOutput).toContain('canvas');
        expect(actualOutput).toContain('width="300"');
        expect(actualOutput).toContain('height="300"');
        expect(actualOutput).toMatchSnapshot();
    });
    //
    it('renders QR code with optional props', () => {
        const actualOutput = render(
            <QrCode
                value="test"
                size={300}
                correctionLevel="L"
                renderAs="canvas"
                bgColor="#FFFFFF"
                fgColor="#000000"
                style={{ backgroundColor: 'blue' }}
            />
        );
        expect(actualOutput).toContain('canvas');
        expect(actualOutput).toContain('width="300"');
        expect(actualOutput).toContain('height="300"');
        expect(actualOutput).toMatchSnapshot();
        expect(actualOutput).toContain('style="background-color:blue"');

    });


});
