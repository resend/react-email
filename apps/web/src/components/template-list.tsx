import { Heading } from './heading';
import { Template } from './template';
import { communityItems, officialItems } from './template-list-data';

export function TemplateList() {
  return (
    <>
      <section className="mb-24">
        <Heading
          as="h2"
          className="px-6 text-slate-12 md:px-8"
          size="3"
          weight="medium"
        >
          Official
        </Heading>
        <div className="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          {officialItems.map((item, index) => (
            <Template key={item.name} index={index} {...item} />
          ))}
        </div>
      </section>

      <section>
        <Heading
          as="h2"
          className="px-6 text-slate-12 md:px-8"
          size="3"
          weight="medium"
        >
          Community
        </Heading>
        <div className="relative grid grid-cols-1 gap-x-4 px-1 pb-10 md:grid-cols-2 md:px-0 lg:grid-cols-3">
          {communityItems.map((item, index) => (
            <Template key={item.name} index={index} {...item} />
          ))}
        </div>
      </section>
    </>
  );
}
