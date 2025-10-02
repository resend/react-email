import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import tailwindConfig from '../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const CodepenChallengersEmail = () => (
  <Html>
    <Head />
    <Tailwind config={tailwindConfig}>
      <Body className="font-codepen bg-[#505050] m-0">
        <Preview>#CodePenChallenge: Cubes</Preview>
        <Section className="w-full bg-[#191919] m-0 mx-auto pb-[30px] z-[999]">
          <Img
            className="mx-auto max-w-full"
            src={`${baseUrl}/static/codepen-challengers.png`}
            width={600}
            alt="codepen"
          />
        </Section>
        <Container className="mx-auto w-[648px] max-w-full relative">
          <Text className="bg-[#505050] text-center py-[10px] text-[13px] absolute w-[648px] max-w-full top-[-28px] m-0 mb-4">
            <Link className="text-white cursor-pointer">
              View this Challenge on CodePen
            </Link>
          </Text>

          <Heading className="bg-[#f0d361] p-[30px] text-[#191919] font-normal mb-0">
            <strong>This week:</strong> #CodePenChallenge:{' '}
            <Text className="text-[32px] mt-1 mb-0">Cubes</Text>
          </Heading>

          <Section className="m-0 bg-white px-6">
            <Text className="text-base">The Shape challenge continues!</Text>

            <Text className="text-base">
              Last week, we kicked things off with round shapes. We "rounded" up
              the Pens from week one in our{' '}
              <Link className="text-[#15c] cursor-pointer">
                #CodePenChallenge: Round
              </Link>{' '}
              collection.
            </Text>

            <Text className="text-base">This week, we move on to cubes 🧊</Text>

            <Text className="text-base">
              Creating cubes in the browser is all about mastery of illusion.
              Take control of perspective and shadows and you can make the magic
              of 3D on a flat screen 🧙
            </Text>

            <Text className="text-base">
              This week is a fun chance to work on your CSS shape-building
              skills, or dig into a 3D JavaScript library like Three.js.
            </Text>

            <Text className="text-base">
              This week's starter template features an ice cube emoji to help
              inspire a "cool" idea for your Pen. As always, the template is
              just as jumping off point. Feel free to incorporate the 🧊 in your
              creation, add more elements, or freeze it out completely and start
              over from scratch!
            </Text>

            <Text className="text-base border-[6px] border-solid border-[#ebd473] p-5 m-0 mb-10">
              💪 <strong>Your Challenge:</strong>{' '}
              <Link className="text-[#15c] cursor-pointer">
                create a Pen that includes cube shapes.
              </Link>
            </Text>

            <Img
              className="max-w-full"
              src={`${baseUrl}/static/codepen-cube.png`}
              width={600}
              alt="codepen"
            />

            <Section className="mt-10 mb-6 text-center bg-[#0b112a] text-white py-[35px] px-5 border-[6px] border-solid border-[#2138c6]">
              <Img
                className="mx-auto mb-[30px]"
                src={`${baseUrl}/static/codepen-pro.png`}
                width={250}
                alt="codepen"
              />

              <Text>
                CodePen PRO combines a bunch of features that can help any
                front-end designer or developer at any experience level.
              </Text>

              <Button className="bg-[#2138c6] text-white border-0 text-[15px] leading-[18px] cursor-pointer rounded p-3">
                <strong>Learn More</strong>
              </Button>
            </Section>
          </Section>

          <Text className="bg-[#f5d247] p-[30px] text-lg leading-6">
            <strong>To participate:</strong>{' '}
            <Link className="text-[#15c] cursor-pointer">Create a Pen →</Link>{' '}
            and tag it{' '}
            <Link className="text-[#15c] cursor-pointer">
              <strong>codepenchallenge</strong>
            </Link>{' '}
            and
            <Link className="text-[#15c] cursor-pointer">
              {' '}
              <strong>cpc-cubes</strong>
            </Link>
            . We'll be watching and gathering the Pens into a Collection, and
            sharing on{' '}
            <Link className="text-[#15c] cursor-pointer">Twitter</Link> and{' '}
            <Link className="text-[#15c] cursor-pointer">Instagram</Link> (Use
            the #CodePenChallenge tag on Twitter and Instagram as well).
          </Text>

          <Section className="m-0 bg-white px-6">
            <Row>
              <Column className="w-1/2 pr-[10px]">
                <Text className="font-black leading-[1.1] text-lg">IDEAS!</Text>

                <Section className="p-5 mb-5 rounded-[10px] text-4xl text-center bg-[#fff4c8] border border-solid border-[#f4d247]">
                  🌟
                  <Text className="text-[13px] text-left">
                    This week we move from 2 dimensions to three! Maybe you
                    could exercise your{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      perspective
                    </Link>{' '}
                    in CSS to create a 3D cube. Or, you can try out creating 3D
                    shapes in JavaScript, using{' '}
                    <Link className="text-[#15c] cursor-pointer">WebGL</Link> or
                    building a{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Three.js scene
                    </Link>
                    .
                  </Text>
                </Section>

                <Section className="p-5 mb-5 rounded-[10px] text-4xl text-center bg-[#fff4c8] border border-solid border-[#f4d247]">
                  🌟
                  <Text className="text-[13px] text-left">
                    There's more to cubes than just six square sides. There are
                    variations on the cube that could be fun to play with this
                    week:{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      cuboid shapes
                    </Link>{' '}
                    are hexahedrons with faces that aren't always squares. And
                    if you want to really push the boundaries of shape, consider
                    the 4 dimensional{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      tesseract!
                    </Link>
                  </Text>
                </Section>

                <Section className="p-5 mb-5 rounded-[10px] text-4xl text-center bg-[#fff4c8] border border-solid border-[#f4d247]">
                  🌟
                  <Text className="text-[13px] text-left">
                    Here's a mind-bending idea that can combine the round shapes
                    from week one with this week's cube theme:{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Spherical Cubes
                    </Link>{' '}
                    😳 Solving longstanding mathematical mysteries is probably
                    outside the scope of a CodePen challenge, but you could use
                    front-end tools to explore fitting spheres into cubes, or
                    vice-versa.
                  </Text>
                </Section>
              </Column>
              <Column className="w-1/2 pl-[10px]">
                <Text className="font-black leading-[1.1] -mt-10 text-lg">
                  RESOURCES!
                </Text>

                <Section className="p-5 mb-5 rounded-[10px] text-4xl text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]">
                  📖
                  <Text className="text-[13px] text-left">
                    Learn all about{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      How CSS Perspective Works
                    </Link>{' '}
                    and how to build a 3D CSS cube from scratch in Amit Sheen's
                    in-depth tutorial for CSS-Tricks. Or, check out stunning
                    examples of WebGL cubes from Matthias Hurrle:{' '}
                    <Link className="text-[#15c] cursor-pointer">Just Ice</Link>{' '}
                    and{' '}
                    <Link className="text-[#15c] cursor-pointer">Posing</Link>.
                  </Text>
                </Section>

                <Section className="p-5 mb-5 rounded-[10px] text-4xl text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]">
                  📖
                  <Text className="text-[13px] text-left">
                    Want to go beyond the square cube? Draw inspiration from
                    EntropyReversed's{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Pulsating Tesseract
                    </Link>
                    , Josetxu's{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Rainbow Cuboid Loader
                    </Link>
                    , or Ana Tudor's{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Pure CSS cuboid jellyfish
                    </Link>
                    .
                  </Text>
                </Section>

                <Section className="p-5 mb-5 rounded-[10px] text-4xl text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]">
                  📖
                  <Text className="text-[13px] text-left">
                    Did that spherical cubes concept pique your interest?
                    Explore Ryan Mulligan's{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Cube Sphere
                    </Link>
                    , Munir Safi's{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      3D Sphere to Cube Animation With Virtual Trackball
                    </Link>{' '}
                    and Ana Tudor's{' '}
                    <Link className="text-[#15c] cursor-pointer">
                      Infinitely unpack prism
                    </Link>{' '}
                    for more mindbending cube concepts that test the boundaries
                    of how shapes interact with each other.
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          <Section className="my-10 mb-[120px] text-center">
            <Button className="text-[26px] text-[#15c] bg-[#222] rounded font-bold cursor-pointer py-[15px] px-[30px]">
              Go to Challenge Page
            </Button>
          </Section>

          <Section className="bg-white text-[#505050] px-6 mb-12">
            <Text className="text-[13px]">
              You can adjust your{' '}
              <Link className="underline text-[#505050] cursor-pointer">
                email preferences
              </Link>{' '}
              any time, or{' '}
              <Link className="underline text-[#505050] cursor-pointer">
                instantly opt out
              </Link>{' '}
              of emails of this kind. Need help with anything? Hit up{' '}
              <Link className="underline text-[#505050] cursor-pointer">
                support
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default CodepenChallengersEmail;
