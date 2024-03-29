import { rest } from "msw"
import { SetupServer, setupServer } from "msw/node"
import { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import AppProvider from "../shared/context";
import { render } from "@testing-library/react";

const registeredAddressTest = {
  id: 4,
  address: "4 Privet Drive, Little Whinging, Surrey County",
  lat_lng: { lat: 51.6913075450287, lng: -0.4167962178607715 }
}
const registeredUserTest = {
  id: 200,
  first_name: "Harry",
  last_name: "Potter",
  email: "harry.potter@hogwarts.com",
  address_id: registeredAddressTest.id
};

const userFormTest = {
  first_name: "Harry",
  last_name: "Potter",
  email: "harry.potter@hogwarts.com",
  id_card: "",
  password: "Levi0s4"
};

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <AppProvider>
        {children}
      </AppProvider>
    </MemoryRouter>
  )
}

function wrapAndRenderRoute(route: ReactElement) { render(route, { wrapper: Wrapper }) }

const serverEvents = (server: SetupServer) => {
  beforeAll(() => server.listen());
  beforeEach(() => server.resetHandlers());
  afterAll(() => server.close());
}

const mockGetRequest = (url: string, mockedData: any) => {
  const server = setupServer(
    rest.get(url, (req, res, ctx) => {
      return res(ctx.json({ data: mockedData }))
    })
  )

  return server;
}

const mockPostRequest = (url: string, mockedData: any) => {
  const server = setupServer(
    rest.post(url, (req, res, ctx) => {
      return res(ctx.json(mockedData))
    })
  )

  return server;
}

export { userFormTest, registeredUserTest, registeredAddressTest, wrapAndRenderRoute, serverEvents, mockGetRequest, mockPostRequest };