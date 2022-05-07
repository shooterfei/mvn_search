import alfy from 'alfy';
import dateFormat from 'dateformat';

let q = alfy.input;
const s = q.split(':');

if (s.length > 1) {
  q = 'g:' + s[0];
  if (s[1]) {
    q = q + ' AND ' + 'a:' + s[1];
  }
  if (s.length > 2 && s[2]) {
    q = q + ' AND ' + 'v:' + s[2];
  }
}

const data = await alfy.fetch('https://search.maven.org/solrsearch/select', {
  searchParams: {
    q,
    start: 0,
    rows: 20
  }
})

const items = data.response.docs
  .map(x => {
    const v = x.v ? x.v : x.latestVersion;
    const mvn = `<dependency>\n  <groupId>${x.g}</groupId>\n  <artifactId>${x.a}</artifactId>\n  <version>${v}</version>\n</dependency>`;
    const gradle = `implementation('${x.g}:${x.a}:${v}')`;
    return {
      title: `${x.g}:${x.a}:${v}`,
      subtitle: `updated at ${dateFormat(new Date(x.timestamp), 'yyyy-dd-MM')}  ${x.versionCount}`,
      arg: mvn,
      mods: {
        cmd: {
          arg: mvn,
          subtitle: `copy maven dependency to clipboard`
        },
        alt: {
          arg: gradle,
          subtitle: `copy gradle dependency to clipboard`
        }
      }
    };
  });



alfy.output(items);
