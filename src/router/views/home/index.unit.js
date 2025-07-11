import Home from './index'

describe('@views/home', () => {
  it('is a valid view', () => {
    expect(Home).toBeAViewComponent()
  })

  it('renders an element', () => {
    const { element } = mountShallowView(Home)
    expect(element.textContent).toContain('Home Page')
  })
})
