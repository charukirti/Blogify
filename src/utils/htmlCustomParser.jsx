export const htmlParserOptions = {
  replace: (domNode) => {
    const getTextContent = (node) => {
      if (!node.children) return "";
      return node.children
        .map((child) => {
          if (child.type === "text") return child.data;
          if (child.children) return getTextContent(child);
          return "";
        })
        .join("");
    };

    if (domNode.name === "h1") {
      return (
        <h1 className="text-4xl font-bold text-gray-200 mb-6 mt-8">
          {getTextContent(domNode)}
        </h1>
      );
    }
    if (domNode.name === "h2") {
      return (
        <h2 className="text-3xl font-semibold text-gray-200 mb-4 mt-6">
          {getTextContent(domNode)}
        </h2>
      );
    }
    if (domNode.name === "h3") {
      return (
        <h3 className="text-2xl font-medium text-gray-300 mb-4 mt-6">
          {getTextContent(domNode)}
        </h3>
      );
    }
    if (domNode.name === "h4") {
      return (
        <h3 className="text-1xl font-medium text-gray-300 mb-4 mt-6">
          {getTextContent(domNode)}
        </h3>
      );
    }
    if (domNode.name === "p") {
      return (
        <p className="text-gray-300 text-base leading-relaxed mb-6">
          {domNode.children.map((child, i) => {
            if (child.type === "text") return child.data;
            return null;
          })}
        </p>
      );
    }

    if (domNode.name === "pre") {
      return (
        <pre className="rounded-lg bg-gray-800 text-gray-200 text-base text-wrap p-4 mb-6 font-mono">
          {getTextContent(domNode)}
        </pre>
      );
    }

    if (domNode.name === "code") {
      // if inside pre no need of style
      const isInsidePre = domNode.parent && domNode.parent.name === "pre";
      if (isInsidePre) {
        return getTextContent(domNode);
      }

      return (
        <code className="bg-gray-800 rounded px-1.5 py-0.5 font-mono text-sm text-gray-200">
          {getTextContent(domNode)}
        </code>
      );
    }
    if (domNode.name === "ul") {
      return (
        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
          {domNode.children.map((child, i) => {
            if (child.name === "li") {
              return (
                <li key={i} className="text-gray-300 text-lg">
                  {getTextContent(child)}
                </li>
              );
            }
            return null;
          })}
        </ul>
      );
    }
    if (domNode.name === "ol") {
      return (
        <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
          {domNode.children.map((child, i) => {
            if (child.name === "li") {
              return (
                <li key={i} className="text-gray-300 text-lg">
                  {getTextContent(child)}
                </li>
              );
            }
            return null;
          })}
        </ol>
      );
    }
    if (domNode.name === "blockquote") {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-400">
          {getTextContent(domNode)}
        </blockquote>
      );
    }
  },
};
