export const htmlParserOptions = {
  replace: (domNode) => {
    if (domNode.name === "h1") {
      return (
        <h1 className="text-4xl font-bold text-gray-200 mb-6 mt-8">
          {domNode.children[0].data}
        </h1>
      );
    }
    if (domNode.name === "h2") {
      return (
        <h2 className="text-3xl font-semibold text-gray-200 mb-4 mt-6">
          {domNode.children[0].data}
        </h2>
      );
    }
    if (domNode.name === "h3") {
      return (
        <h3 className="text-2xl font-medium text-gray-300 mb-4 mt-6">
          {domNode.children[0].data}
        </h3>
      );
    }
    if (domNode.name === "p") {
      return (
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          {domNode.children[0].data}
        </p>
      );
    }
    if (domNode.name === "ul") {
      return (
        <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
          {domNode.children}
        </ul>
      );
    }
    if (domNode.name === "ol") {
      return (
        <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
          {domNode.children}
        </ol>
      );
    }
    if (domNode.name === "li") {
      return (
        <li className="text-gray-300 text-lg">{domNode.children[0].data}</li>
      );
    }
    if (domNode.name === "blockquote") {
      return (
        <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-400">
          {domNode.children[0].data}
        </blockquote>
      );
    }
  },
};
