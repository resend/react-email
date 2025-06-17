import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Heading,
	Text,
	Tailwind,
} from "@react-email/components";

export default function Example() {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="font-sans margin-0 p-0">
					<Container className="p-4">
						<Section className="bg-gray-100 p-5 rounded-lg">
							<Heading className="text-gray-400">Hello, World!</Heading>
							<Text className="text-gray-400">
								This is a simple email template using React Email.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
