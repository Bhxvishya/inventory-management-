import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import type { ReactNode } from 'react';

hydrateRoot(document, <RemixBrowser /> as ReactNode);